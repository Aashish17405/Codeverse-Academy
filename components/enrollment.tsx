"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, Users } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

export default function Enrollment() {
  const { toast } = useToast();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Demo Session", // Fixed plan - no longer selectable
    sessionId: "", // Added for demo session booking
  });

  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  const LOADING_SENTENCES = [
    "🚀 Launching your path into AI, Web3 & MERN mastery…",
    "🔍 Searching the blockchain for your perfect session…",
    "🎓 One step closer to becoming a certified fullstack + AI developer!",
    "🧠 Assembling code, crypto, and cognition… Just a sec!",
    "⚡ Booking your AstraTech demo seat—where real tech skills begin.",
    "💡 Connecting you with mentors in AI, Blockchain, and Web Dev...",
    "📚 Lining up real projects, hackathons & internships for you...",
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
          toast({
            title: "Error",
            description:
              data.error ||
              "Failed to load available sessions. Please try again.",
            variant: "destructive",
          });
          setSessions([]);
        } else {
          console.error("Unexpected API response format:", data);
          toast({
            title: "Error",
            description: "Received unexpected data format. Please try again.",
            variant: "destructive",
          });
          setSessions([]);
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
        toast({
          title: "Error",
          description: "Failed to load available sessions. Please try again.",
          variant: "destructive",
        });
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    }
    fetchSessions();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSessionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sessionId: value }));
  };

  const closeTicket = () => {
    setShowTicket(false);
    setTicketData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sessionId) {
      toast({
        title: "Session Required",
        description: "Please select a demo session to continue.",
        variant: "destructive",
      });
      return;
    }

    const randomSentence =
      LOADING_SENTENCES[Math.floor(Math.random() * LOADING_SENTENCES.length)];
    setLoadingMessage(randomSentence);
    setLoading(true);

    try {
      // console.log("Form submitted:", formData);

      const selectedSession = sessions.find((s) => s.id === formData.sessionId);
      if (!selectedSession) {
        toast({
          title: "Invalid Session",
          description: "The selected session is not available.",
          variant: "destructive",
        });
        return;
      }

      const ticketRes = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          sessionId: selectedSession.id,
        }),
      });

      const result = await ticketRes.json();

      if (!ticketRes.ok) {
        throw new Error(result.error || "Ticket creation failed");
      }

      const timeSlot =
        selectedSession.courseName === "regular"
          ? "4:00 PM - 6:00 PM"
          : "6:00 PM - 8:00 PM";

      setTicketData({
        ticketId: result.ticket.id,
        name: formData.name,
        email: formData.email,
        course: selectedSession.courseName,
        date: new Date(result.ticket.sessionDate),
        timeSlot,
        status: "CONFIRMED",
      });

      // Show success message
      toast({
        title: "Enrollment Request Submitted!",
        description: "Your demo session has been booked successfully.",
      });

      // Show ticket
      setShowTicket(true);

      // Reset form (plan is fixed)
      setFormData({
        name: "",
        email: "",
        phone: "",
        plan: "fasttrack-single", // Keep the fixed plan
        sessionId: "",
      });
    } catch (err) {
      console.error("Booking Error:", err);
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "fasttrack-single",
      name: "FastTrack Course",
      price: "₹15,000",
      description: "Individual enrollment",
      features: [
        "Daily live sessions",
        "24/7 mentor support",
        "Real-world projects",
        "Industry certification",
        "Job placement assistance",
      ],
      popular: true,
    },
    {
      id: "fasttrack-pair",
      name: "FastTrack Course",
      price: "₹25,000",
      description: "For a pair joining together",
      features: [
        "Daily live sessions",
        "24/7 mentor support",
        "Real-world projects",
        "Industry certification",
        "Job placement assistance",
      ],
      popular: false,
    },
    {
      id: "beginner-single",
      name: "Beginner to Advanced",
      price: "₹20,000",
      description: "Single enrollment",
      features: [
        "Weekend live sessions",
        "Business hours support",
        "Self-paced modules",
        "Industry certification",
        "Career guidance",
      ],
      popular: false,
    },
    {
      id: "beginner-pair",
      name: "Beginner to Advanced",
      price: "₹35,000",
      description: "For a pair enrolling together",
      features: [
        "Weekend live sessions",
        "Business hours support",
        "Self-paced modules",
        "Industry certification",
        "Career guidance",
      ],
      popular: false,
    },
  ];

  const groupedPlans = [
    {
      course: "FastTrack Course",
      features: [
        "Daily live sessions",
        "24/7 mentor support",
        "Real-world projects",
        "Industry certification",
        "Job placement assistance",
      ],
      options: [
        { id: "fasttrack-single", label: "Solo Enrollment", price: "₹15,000" },
        {
          id: "fasttrack-pair",
          label: "Enroll with a Friend",
          price: "₹25,000 (₹12,500 each)",
        },
      ],
    },
    {
      course: "Beginner to Advanced",
      features: [
        "Weekend live sessions",
        "Business hours support",
        "Self-paced modules",
        "Industry certification",
        "Career guidance",
      ],
      options: [
        { id: "beginner-single", label: "Solo Enrollment", price: "₹20,000" },
        {
          id: "beginner-pair",
          label: "Enroll with a Friend",
          price: "₹35,000 (₹17,500 each)",
        },
      ],
    },
  ];

  return (
    <section id="enrollment" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Secure Your Spot Today
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            With limited seats available, don't miss your chance to transform
            your career with our cutting-edge program.
          </p>
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 text-sm font-medium mt-4 border border-cyan-500/20">
            <Users className="inline-block w-4 h-4 mr-2" />
            Only 30 students per batch!
          </div>
        </motion.div>

        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {groupedPlans.map((group) => (
              <div
                key={group.course}
                className="rounded-xl border p-6 bg-gray-800 shadow-lg"
              >
                <h3 className="text-xl text-white font-semibold mb-2">
                  {group.course}
                </h3>
                <div className="border-b border-gray-700 mb-3 pb-2">
                  <div className="text-cyan-400 font-medium">
                    Course Features:
                  </div>
                </div>
                <ul className="mt-3 mb-4 space-y-2">
                  {group.features.map((feature, i) => (
                    <li
                      key={i}
                      className="text-gray-300 text-sm flex items-start"
                    >
                      <Check className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {group.options.map((option) => (
                    <div
                      key={option.id}
                      className="p-4 rounded-lg border-2 border-gray-600 bg-gray-700/50"
                    >
                      <div className="text-white font-medium">
                        {option.label}
                      </div>
                      <div className="text-lg text-cyan-400">
                        {option.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Enrollment Form
                </CardTitle>
                <CardDescription>
                  Fill out the form below to secure your spot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session" className="text-white">
                      Select a Demo Session
                    </Label>
                    <Select
                      value={formData.sessionId}
                      onValueChange={handleSessionChange}
                    >
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Choose session date & course" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessionsLoading ? (
                          <div className="flex items-center justify-center p-2">
                            <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                          </div>
                        ) : !Array.isArray(sessions) ? (
                          <div className="p-2 text-center text-gray-500">
                            Error loading sessions. Please refresh.
                          </div>
                        ) : sessions.length === 0 ? (
                          <div className="p-2 text-center text-gray-500">
                            No sessions available
                          </div>
                        ) : (
                          sessions.map((session) => (
                            <SelectItem key={session.id} value={session.id}>
                              {session.courseName === "zero-to-advanced"
                                ? "Zero to Advanced"
                                : "Zero to Advanced"}{" "}
                              — {format(new Date(session.date), "PPP")} (
                              {session.ticketCount}/{session.capacity})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

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
                      "Book Demo Class"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
