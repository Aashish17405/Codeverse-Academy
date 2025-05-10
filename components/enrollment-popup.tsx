"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Users } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DemoTicket } from "@/components/DemoTicket";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  sessionId: z.string({ required_error: "Please select a session" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EnrollmentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const LOADING_SENTENCES = [
    "🚀 Launching your path into AI, Web3 & MERN mastery…",
    "🔍 Searching the blockchain for your perfect session…",
    "🎓 One step closer to becoming a certified AI developer!",
    "🧠 Assembling code, crypto, and cognition… Just a sec!",
    "💡 Connecting you with mentors in AI, Blockchain & Web Dev...",
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
      sessionId: "",
    },
  });

  useEffect(() => {
    // Check if popup was shown today
    const checkPopupShown = () => {
      const lastShown = localStorage.getItem("popupLastShown");
      const today = new Date().toDateString();

      if (!lastShown || lastShown !== today) {
        // Show popup after 15 seconds if not shown today
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 15000);

        return () => clearTimeout(timer);
      }
    };

    checkPopupShown();
  }, []);

  useEffect(() => {
    async function fetchSessions() {
      setSessionsLoading(true);
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setSessionsLoading(false);
      }
    }

    if (isVisible) {
      fetchSessions();
    }
  }, [isVisible]);

  const closePopup = () => {
    setIsVisible(false);
    // Store today's date in localStorage
    localStorage.setItem("popupLastShown", new Date().toDateString());
  };

  const closeTicket = () => {
    setShowTicket(false);
    setTicketData(null);
    closePopup();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const randomSentence =
        LOADING_SENTENCES[Math.floor(Math.random() * LOADING_SENTENCES.length)];
      setLoadingMessage(randomSentence);
      setLoading(true);
      const selectedSession = sessions.find((s) => s.id === data.sessionId);
      if (!selectedSession) {
        alert("Invalid session selected.");
        return;
      }

      const ticketRes = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
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
        course: selectedSession.courseName,
        date: new Date(result.ticket.sessionDate),
        timeSlot,
        venue:
          "Suman Tower, 3rd Floor, Above ICICI Bank, Adityapur 1, Jamshedpur",
      });

      setIsVisible(false);
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
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              // Close popup when clicking outside the card
              if (e.target === e.currentTarget) {
                closePopup();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
              <Card className="bg-gray-800 border-gray-700 overflow-hidden relative">
                <Button
                  onClick={closePopup}
                  className="absolute top-2 right-2 z-10 rounded-full p-1 h-auto bg-transparent hover:bg-gray-700"
                  size="sm"
                  variant="ghost"
                >
                  <X className="h-5 w-5 text-gray-400" />
                  <span className="sr-only">Close</span>
                </Button>

                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-xl flex justify-center items-center text-white">
                    Book a Free Demo Class
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="mb-4 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 text-sm font-medium mb-2 border border-cyan-500/20">
                      <Users className="inline-block w-4 h-4 mr-1" />
                      Only 30 students per batch!
                    </div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Reserve your spot now!
                    </h3>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 py-2"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                {...field}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
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
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email address"
                                type="email"
                                {...field}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
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
                            <FormLabel className="text-white">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your phone number"
                                {...field}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sessionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Select a Demo Session
                            </FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                  <SelectValue placeholder="Choose session date & course" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sessionsLoading ? (
                                  <div className="flex items-center justify-center p-2">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                  </div>
                                ) : sessions.length === 0 ? (
                                  <div className="p-2 text-center text-gray-500">
                                    No sessions available
                                  </div>
                                ) : (
                                  sessions.map((session) => (
                                    <SelectItem
                                      key={session.id}
                                      value={session.id}
                                    >
                                      {session.courseName === "zero-to-advanced"
                                        ? "Zero to advanced"
                                        : "Fast-Track"}{" "}
                                      — {format(new Date(session.date), "PPP")}{" "}
                                      ({session.ticketCount}/{session.capacity})
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="text-sm text-black text-center animate-pulse">
                            {loadingMessage}
                          </div>
                        ) : (
                          "Reserve Your Spot"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTicket && ticketData && (
        <DemoTicket ticketData={ticketData} onClose={closeTicket} />
      )}
    </>
  );
}
