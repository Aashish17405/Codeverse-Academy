"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  sessionId: z.string({ required_error: "Please select a demo session" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminDemoBookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);

  // Fetch available sessions when component mounts
  useEffect(() => {
    async function fetchSessions() {
      setSessionsLoading(true);
      try {
        const res = await fetch("/api/admin/sessions");
        const data = await res.json();

        if (Array.isArray(data)) {
          setSessions(data);
        } else if (data.error) {
          console.error("API error:", data.error);
          toast.error(data.error || "Failed to load available sessions");
          setSessions([]);
        } else {
          console.error("Unexpected API response format:", data);
          toast.error("Received unexpected data format");
          setSessions([]);
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
        toast.error("Failed to load available sessions");
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sessionId: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Find the selected session
      const selectedSession = sessions.find((s) => s.id === data.sessionId);
      if (!selectedSession) {
        toast.error("Invalid session selected");
        return;
      }

      // Book the ticket
      const ticketRes = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          sessionId: data.sessionId,
        }),
      });

      if (!ticketRes.ok) throw new Error("Ticket creation failed");
      const { ticket } = await ticketRes.json();

      // Determine time slot based on course name
      const timeSlot =
        selectedSession.courseName === "regular"
          ? "4:00 PM - 6:00 PM"
          : "6:00 PM - 8:00 PM";

      // Set ticket data for display
      setTicketData({
        ticketId: ticket.id,
        name: data.name,
        email: data.email,
        course: selectedSession.courseName,
        date: new Date(selectedSession.date),
        timeSlot,
        status: "CONFIRMED",
      });

      toast.success(
        `Demo ticket for ${ticket.user.name} has been created and emailed.`
      );
      setShowTicket(true);

      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("There was a problem booking the demo session.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeTicket = () => {
    setShowTicket(false);
    setTicketData(null);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter candidate's full name"
                      {...field}
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
                      placeholder="Enter email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
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
                  <FormLabel>Select Demo Session</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                              ? "Zero to Advanced"
                              : "Fast-Track Course"}{" "}
                            — {format(new Date(session.date), "PPP")} (
                            {session.ticketCount}/{session.capacity})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select from available demo sessions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Processing...</span>
              </div>
            ) : (
              "Book Demo Session"
            )}
          </Button>
        </form>
      </Form>

      {/* Demo Ticket Modal */}
      {showTicket && ticketData && (
        <DemoTicket ticketData={ticketData} onClose={closeTicket} />
      )}
    </>
  );
}
