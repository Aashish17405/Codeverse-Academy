"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DemoTicket } from "@/components/DemoTicket";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  sessionId: z.string({ required_error: "Please select a session" }),
});

type FormValues = z.infer<typeof formSchema>;

export function DemoBookingForm({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sessionId: "",
    },
  });

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

  useEffect(() => {
    async function fetchSessions() {
      setSessionsLoading(true);
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();

        if (Array.isArray(data)) {
          setSessions(data);
        } else if (data.error) {
          console.error("API error:", data.error);
          setSessions([]);
        } else {
          console.error("Unexpected API response format:", data);
          setSessions([]);
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    }
    fetchSessions();
  }, []);

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

      setOpen(false);
      setShowTicket(true);
      form.reset();
    } catch (err) {
      console.error("❌ Booking Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = () => {
    setShowTicket(false);
    setTicketData(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[95%] max-w-[500px] p-4 md:p-6">
          <DialogHeader className="text-center md:text-left">
            <DialogTitle className="text-xl">
              Book a Free Demo Class
            </DialogTitle>
            <DialogDescription>
              Fill in your details to schedule a free demo class with our expert
              instructors.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-2 md:py-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
                        placeholder="Enter your email address"
                        type="email"
                        {...field}
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
                      <Input placeholder="Enter your phone number" {...field} />
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
                    <FormLabel>Select a Demo Session</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                            <SelectItem key={session.id} value={session.id}>
                              {session.courseName === "zero-to-advanced"
                                ? "Zero to advanced"
                                : "Fast-Track"}{" "}
                              — {format(new Date(session.date), "PPP")} (
                              {session.ticketCount}/{session.capacity})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
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
                    <div className="text-sm text-white text-center">
                      Reserve Your Spot
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {showTicket && ticketData && (
        <DemoTicket ticketData={ticketData} onClose={closeTicket} />
      )}
    </>
  );
}
