"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DemoTicket } from "@/components/DemoTicket";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
});

type FormValues = z.infer<typeof formSchema>;

interface Session {
  id: string;
  date: string;
  courseName: string;
  capacity: number;
  ticketCount: number;
}

export default function EnrollmentPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [firstSessionFilled, setFirstSessionFilled] = useState(false);
  const [earliestFilledSession, setEarliestFilledSession] =
    useState<Session | null>(null);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);

  const LOADING_SENTENCES = [
    "🚀 Launching your path into AI, Web3 & MERN mastery…",
    "🔍 Searching the blockchain for your perfect session…",
    "🎓 One step closer to becoming a certified AI developer!",
    "🧠 Assembling code, crypto, and cognition… Just a sec!",
    "💡 Connecting you with mentors in AI & Web Dev...",
    "🧑‍💻 Building your custom path to tech career success...",
    "🔐 Securing your future in cutting-edge development...",
    "💫 Aligning stars for your career in AI, Web3 & beyond...",
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    async function fetchSessions() {
      setSessionsLoading(true);
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        setSessions(data);

        const sortedSessions = [...data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const firstSession = sortedSessions[0];
        const availableSession = sortedSessions.find(
          (session) => session.ticketCount < session.capacity
        );

        if (
          firstSession &&
          availableSession &&
          firstSession.id !== availableSession.id
        ) {
          setFirstSessionFilled(true);
          setEarliestFilledSession(firstSession);
        }

        if (availableSession) {
          setSelectedSession(availableSession);
        } else {
          console.error("No sessions with available capacity");
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setSessionsLoading(false);
      }
    }

    fetchSessions();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!selectedSession) {
      alert("No available session found. Please try again later.");
      return;
    }

    try {
      const randomSentence =
        LOADING_SENTENCES[Math.floor(Math.random() * LOADING_SENTENCES.length)];
      setLoadingMessage(randomSentence);
      setLoading(true);

      const ticketRes = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          sessionId: selectedSession.id,
        }),
      });

      const result = await ticketRes.json();
      if (!ticketRes.ok)
        throw new Error(result.error || "Ticket creation failed");

      const timeSlot =
        selectedSession.courseName === "regular"
          ? "4:00 PM - 6:00 PM"
          : "6:00 PM - 8:00 PM";

      setTicketData({
        ticketId: result.ticket.id,
        name: data.name,
        email: data.email,
        course: result.ticket.courseName || selectedSession.courseName,
        date: new Date(result.ticket.sessionDate),
        timeSlot,
        sessionId: selectedSession.id,
        phone: data.phone,
        venue:
          "Suman Tower, 3rd Floor, Above ICICI Bank, Adityapur 1, Jamshedpur",
      });

      setShowTicket(true);
      form.reset();
    } catch (err) {
      console.error("❌ Booking Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center justify-center bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Book a Free Demo Class</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* {selectedSession && (
              <div className="p-3 border border-blue-500/20 rounded-md bg-blue-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Session:</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {selectedSession.ticketCount}/{selectedSession.capacity} spots
                  </div>
                </div>
                <div className="text-white font-semibold">
                  {selectedSession.courseName} - {format(new Date(selectedSession.date), "PPP")}
                </div>
                {firstSessionFilled && earliestFilledSession && (
                  <div className="mt-1 text-xs flex items-center text-amber-300">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <motion.span
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      Earlier session on {format(new Date(earliestFilledSession.date), "MMM d")} is full
                    </motion.span>
                  </div>
                )}
              </div>
            )} */}

            {/* {sessionsLoading ? (
              <div className="text-center">Loading session details...</div>
            ) : !selectedSession ? (
              <div className="text-center text-red-300">No available sessions</div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enten your full name" className="bg-gray-700 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} placeholder="Enten your Email address" className="bg-gray-700 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enten your contact number" className="bg-gray-700 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {loading ? loadingMessage : "Reserve Your Spot"}
                  </Button>
                </form>
              </Form>
            )} */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enten your full name"
                          className="bg-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="Enten your Email address"
                          className="bg-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enten your contact number"
                          className="bg-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? loadingMessage : "Reserve Your Spot"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* {showTicket && ticketData && (
        <DemoTicket
          ticketData={ticketData}
          onClose={() => setShowTicket(false)}
          setTicketUrl={setTicketUrl}
        />
      )} */}
    </div>
  );
}
