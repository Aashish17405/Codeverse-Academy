"use client";

import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Mail,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
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
import { Badge } from "@/components/ui/badge";
import { DemoTicket } from "@/components/DemoTicket";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

export default function AttendeeList() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

      // console.log("✅ Ticket updated:", result);
    } catch (err) {
      toast.error("Failed to update ticket. Please try again.");
      console.error("❌ Error updating ticket:", err);
    }
  };

  // Function to delete ticket
  const deleteTicket = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete ticket");
      }

      // Remove ticket from local state
      setSessions((prev) => prev.filter((session) => session.id !== id));
      toast.success("Ticket deleted successfully");
    } catch (err) {
      console.error("Error deleting ticket:", err);
      toast.error("Failed to delete ticket. Please try again.");
    } finally {
      setIsDeleting(false);
      setTicketToDelete(null);
    }
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
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by name, email, phone or ID..."
            className="pl-8 text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sessions Table */}
      <div className="rounded-md border border-gray-700 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">ID</TableHead>
              <TableHead className="text-xs sm:text-sm">Name</TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                Contact
              </TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                Course
              </TableHead>
              <TableHead className="text-xs sm:text-sm">Date & Time</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500 text-sm sm:text-base"
                >
                  No demo sessions found
                </TableCell>
              </TableRow>
            ) : (
              [...filteredSessions].reverse().map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium text-xs sm:text-sm">
                    {session.id}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {session.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs sm:text-sm flex items-center">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />{" "}
                        {session.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                    {session.course}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs sm:text-sm flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />{" "}
                        {format(session.date, "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs sm:text-sm flex items-center">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />{" "}
                        {session.timeSlot}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {getStatusBadge(session.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs sm:text-sm">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => viewTicket(session)}
                          className="text-xs sm:text-sm"
                        >
                          View Ticket
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs sm:text-sm">
                          Update Status
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => updateStatus(session.id, "ATTENDED")}
                          disabled={isUpdating === session.id}
                          className="text-xs sm:text-sm"
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
                          className="text-xs sm:text-sm"
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
                          className="text-xs sm:text-sm"
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
                          className="text-xs sm:text-sm"
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
                          onClick={() => setTicketToDelete(session.id)}
                          className="text-red-500 focus:text-red-500 text-xs sm:text-sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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
          setTicketUrl={setTicketUrl}
          ticketData={selectedSession}
          onClose={() => setShowTicket(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!ticketToDelete}
        onOpenChange={() => setTicketToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              ticket and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ticketToDelete && deleteTicket(ticketToDelete)}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
