"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Users,
  Calendar,
  AlertCircle,
  ShareIcon,
  Share2,
} from "lucide-react";
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
import { toast } from "sonner";

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

interface EnrollmentPopupProps {
  initialVisible?: boolean;
  onClose?: () => void;
}

export default function EnrollmentPopup({
  initialVisible = false,
  onClose,
}: EnrollmentPopupProps = {}) {
  const [isVisible, setIsVisible] = useState(initialVisible);
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

  // Effect to handle initialVisible changes
  useEffect(() => {
    setIsVisible(initialVisible);
  }, [initialVisible]);

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

    // Only run the auto-popup logic if not explicitly shown via props
    if (!initialVisible) {
      checkPopupShown();
    }
  }, [initialVisible]);

  useEffect(() => {
    async function fetchSessions() {
      setSessionsLoading(true);
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();

        // Get current time
        const now = new Date().getTime();

        // Filter out past sessions (only upcoming sessions)
        const upcomingSessions = data.filter(
          (session: Session) => new Date(session.date).getTime() > now
        );

        // Set only upcoming sessions
        setSessions(upcomingSessions);

        // Sort upcoming sessions by date (earliest first)
        const sortedSessions = [...upcomingSessions].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Find the earliest upcoming session with capacity
        const firstSession = sortedSessions[0];
        const availableSession = sortedSessions.find(
          (session) => session.ticketCount < session.capacity
        );

        // If the earliest session is filled
        if (
          firstSession &&
          availableSession &&
          firstSession.id !== availableSession.id
        ) {
          setFirstSessionFilled(true);
          setEarliestFilledSession(firstSession);
        }
        
        // Set the selected session to the available one
        if (availableSession) {
          setSelectedSession(availableSession);
        } else {
          // No sessions with capacity available
          console.error("No sessions with available capacity");
        }

        console.log("Available session:", selectedSession);
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
    // Call the onClose callback first
    if (onClose) {
      onClose();
    }
    // Then update local state
    setIsVisible(false);
    setShowTicket(false);
    setTicketData(null);
    // Store today's date in localStorage
    localStorage.setItem("popupLastShown", new Date().toDateString());
  };

  const closeTicket = () => {
    setShowTicket(false);
    setTicketData(null);
    closePopup();
  };

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
          phone: data.phone,
        }),
      });

      const result = await ticketRes.json();
      if (!ticketRes.ok)
        throw new Error(result.error || "Ticket creation failed");

      const mailSent = await fetch("/api/sendTicketEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          sessionId: selectedSession.id,
          ticketId: result.ticket.id,
          ticketImage: ticketUrl,
        }),
      });

      const mailResult = await mailSent.json();
      if (!mailSent.ok)
        throw new Error(mailResult.error || "Failed to send ticket email");

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
        sessionId: selectedSession.id, // Add sessionId for the ticket email
        phone: data.phone, // Include phone for potential future use
        venue:
          "Suman Tower, 2nd Floor, Above HDFC Bank, Adityapur 1, Hyderabad 831013",
      });

      setShowTicket(true);
      form.reset();
      toast.success("Registration successful!");
    } catch (err) {
      console.error("❌ Booking Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      // Don't close popup here - let the ticket show first
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://www.astratechai.com/enrollment");
    toast.success("Enrollment link copied to clipboard!", {
      duration: 3000,
    });
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && !showTicket && (
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

                <CardHeader className="pb-2 text-center relative">
                  <CardTitle className="text-xl flex justify-center items-center text-white">
                    Register Now
                    <div className="ml-2 bg-gray-700/50 rounded-full hover:bg-gray-600">
                      <Button
                        onClick={handleShare}
                        className="bg-transparent text-white hover:bg-white/10 rounded-full"
                        size="icon"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
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
                  {selectedSession && (
                    <div className="mb-4 p-3 border border-blue-500/20 rounded-md bg-blue-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">Session:</span>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {selectedSession.ticketCount}/
                          {selectedSession.capacity} spots
                        </div>
                      </div>
                      <div className="text-white font-semibold">
                        {selectedSession.courseName} -{" "}
                        {format(new Date(selectedSession.date), "PPP")}
                      </div>

                      {firstSessionFilled && earliestFilledSession && (
                        <div className="mt-1 text-xs flex items-center text-amber-300">
                          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                          <motion.span
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            Earlier session on{" "}
                            {format(
                              new Date(earliestFilledSession.date),
                              "MMM d"
                            )}{" "}
                            is full
                          </motion.span>
                        </div>
                      )}
                    </div>
                  )}{" "}
                  {sessionsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : !selectedSession ? (
                    <div className="text-center py-4 text-red-300">
                      No available sessions found. Please check back later.
                    </div>
                  ) : (
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
                              <FormLabel className="text-white">
                                Email
                              </FormLabel>
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

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="text-sm text-white text-center animate-pulse">
                              {loadingMessage}
                            </div>
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                  {/* <Form {...form}>
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
                              <FormLabel className="text-white">
                                Email
                              </FormLabel>
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

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="text-sm text-white text-center animate-pulse">
                              {loadingMessage}
                            </div>
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </form>
                    </Form> */}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTicket && ticketData && (
        <DemoTicket
          ticketData={ticketData}
          onClose={closeTicket}
          setTicketUrl={setTicketUrl}
        />
      )}
    </>
  );
}
