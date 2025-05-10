"use client";

import { format } from "date-fns";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DemoTicket } from "@/components/DemoTicket";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SessionData = {
  id: string;
  name: string;
  email: string;
  course: string;
  date: Date;
  timeSlot: string;
  phone?: string;
  status: string;
};

// Mock data for demo sessions
const mockSessions = [
  {
    id: "DEMO-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    course: "regular",
    date: new Date(2023, 6, 15),
    timeSlot: "4:00 PM - 6:00 PM",
    status: "confirmed",
  },
  {
    id: "DEMO-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "8765432109",
    course: "fasttrack",
    date: new Date(2023, 6, 16),
    timeSlot: "6:00 PM - 8:00 PM",
    status: "pending",
  },
  {
    id: "DEMO-003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "7654321098",
    course: "regular",
    date: new Date(2023, 6, 17),
    timeSlot: "4:00 PM - 6:00 PM",
    status: "attended",
  },
  {
    id: "DEMO-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "6543210987",
    course: "fasttrack",
    date: new Date(2023, 6, 18),
    timeSlot: "6:00 PM - 8:00 PM",
    status: "cancelled",
  },
  {
    id: "DEMO-005",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    phone: "5432109876",
    course: "regular",
    date: new Date(2023, 6, 19),
    timeSlot: "4:00 PM - 6:00 PM",
    status: "confirmed",
  },
];

export default function DemoSessionsList() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();

        if (data.users && Array.isArray(data.users)) {
          const parsed: SessionData[] = data.users.flatMap((user: any) =>
            user.courses.map((course: any) => ({
              id: course.ticketId,
              name: user.name,
              email: user.email,
              phone: "N/A", // add phone field if available in schema
              course: course.courseName || "unknown",
              date: new Date(course.sessionDate),
              timeSlot: "6:00 PM - 8:00 PM", // you can add exact time if available
              status: course.status?.toLowerCase() || "unknown",
            }))
          );
          setSessions(parsed);
        } else if (data.error) {
          console.error("API error:", data.error);
          toast.error(data.error || "Failed to load sessions");
          setSessions([]);
        } else {
          console.error("Unexpected API response format:", data);
          toast.error("Received unexpected data format");
          setSessions([]);
        }
      } catch (err) {
        console.error("Error fetching session data:", err);
        toast.error("Failed to load sessions. Please try again.");
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessions();
  }, []);

  // Filter sessions based on search term
  const filteredSessions = sessions.filter((session) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session.name.toLowerCase().includes(searchLower) ||
      session.email.toLowerCase().includes(searchLower) ||
      session.id.toLowerCase().includes(searchLower)
    );
  });

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();

    switch (s) {
      case "CREATED":
        return <Badge className="bg-blue-500">Created</Badge>;
      case "ATTENDED":
        return <Badge className="bg-green-500">Attended</Badge>;
      case "NOT_ATTENDED":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Not Attended
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "SUBSCRIBED":
        return <Badge className="bg-purple-500">Subscribed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Function to update session status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          sendEmail: true, // set to false if you don't want to send email
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update ticket");
      }

      // Update session in local state
      setSessions((prev) =>
        prev.map((session) =>
          session.id === id
            ? { ...session, status: result.ticket.status }
            : session
        )
      );

      toast.success(`Ticket status updated to ${newStatus}`);

      console.log("✅ Ticket updated:", result);
    } catch (err) {
      toast.error("Failed to update ticket. Please try again.");
      console.error("❌ Error updating ticket:", err);
    }
  };

  // Function to delete session
  const deleteSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  // Function to view ticket
  const viewTicket = (session: any) => {
    setSelectedSession({
      ticketId: session.id,
      name: session.name,
      email: session.email,
      phone: session.phone,
      course: session.course,
      date: session.date,
      timeSlot: session.timeSlot,
    });
    setShowTicket(true);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by name, email, phone or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sessions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No demo sessions found
                </TableCell>
              </TableRow>
            ) : (
              [...filteredSessions].reverse().map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.id}</TableCell>
                  <TableCell>{session.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs flex items-center">
                        <Mail className="h-3 w-3 mr-1" /> {session.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {session.course === "regular"
                      ? "Regular Batch"
                      : "Fast-Track Batch"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />{" "}
                        {format(session.date, "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {session.timeSlot}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => viewTicket(session)}>
                          View Ticket
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => updateStatus(session.id, "ATTENDED")}
                          disabled={isUpdating === session.id}
                        >
                          {isUpdating === session.id ? (
                            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          )}
                          Mark as Attended
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatus(session.id, "NOT_ATTENDED")
                          }
                          disabled={isUpdating === session.id}
                        >
                          {isUpdating === session.id ? (
                            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                          )}
                          Mark as Not Attended
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(session.id, "CANCELLED")}
                          disabled={isUpdating === session.id}
                        >
                          {isUpdating === session.id ? (
                            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                          ) : (
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          )}
                          Mark as Cancelled
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(session.id, "SUBSCRIBED")}
                          disabled={isUpdating === session.id}
                        >
                          {isUpdating === session.id ? (
                            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                          ) : (
                            <XCircle className="h-4 w-4 mr-2 text-purple-500" />
                          )}
                          Mark as Subscribed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />{" "}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Ticket Popup */}
      {showTicket && selectedSession && (
        <DemoTicket
          ticketData={selectedSession}
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  );
}
