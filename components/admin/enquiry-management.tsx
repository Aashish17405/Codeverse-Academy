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
  Download,
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

type EnquiryData = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
};

export default function EnquiryManagement() {
  const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEnquiries() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/enquiry");
        const data = await res.json();

        if (data.enquiries) {
          setEnquiries(data.enquiries);
        } else {
          console.error("Unexpected response format:", data);
          setEnquiries([]);
        }
      } catch (err) {
        console.error("Error fetching enquiry data:", err);
        toast.error("Failed to load enquiries. Please try again.");
        setEnquiries([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEnquiries();
  }, []);

  // Filter enquiries based on search term
  const filteredSessions = enquiries.filter((enquiry) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      enquiry.name.toLowerCase().includes(searchLower) ||
      enquiry.email.toLowerCase().includes(searchLower) ||
      enquiry.id.toLowerCase().includes(searchLower) ||
      enquiry.phoneNumber.toLowerCase().includes(searchLower)
    );
  });

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();

    switch (s) {
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "RESOLVED":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "CLOSED":
        return <Badge variant="destructive">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Function to update enquiry status
  const updateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/admin/enquiry`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update enquiry");
      }

      // Update enquiry in local state with the returned data
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry.id === id
            ? { ...enquiry, ...result, updatedAt: new Date(result.updatedAt) }
            : enquiry
        )
      );

      toast.success(`Enquiry status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update enquiry. Please try again.");
      console.error("❌ Error updating enquiry:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  // Function to convert data to CSV and trigger download
  const exportToCSV = () => {
    // Get the filtered data
    const dataToExport = filteredSessions;

    // Define CSV headers
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone Number",
      "Status",
      "Created At",
      "Updated At",
    ];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(","),
      ...dataToExport.map((enquiry) =>
        [
          enquiry.id,
          `"${enquiry.name.replace(/"/g, '""')}"`,
          `"${enquiry.email.replace(/"/g, '""')}"`,
          `"${enquiry.phoneNumber.replace(/"/g, '""')}"`,
          enquiry.status,
          format(enquiry.createdAt, "yyyy-MM-dd HH:mm:ss"),
          format(enquiry.updatedAt, "yyyy-MM-dd HH:mm:ss"),
        ].join(",")
      ),
    ];

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `enquiries_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <Button
          variant="outline"
          size="icon"
          onClick={exportToCSV}
          title="Export to CSV"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* enquiries Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base">Name</TableHead>
              <TableHead className="text-base hidden md:table-cell">
                Phone Number
              </TableHead>
              <TableHead className="text-base hidden md:table-cell">
                Email
              </TableHead>
              <TableHead className="text-base">Created At</TableHead>
              <TableHead className="text-base">Updated At</TableHead>
              <TableHead className="text-base">Status</TableHead>
              <TableHead className="text-right text-base">Actions</TableHead>
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
                  className="text-center py-8 text-gray-500 text-base"
                >
                  No enquiries found
                </TableCell>
              </TableRow>
            ) : (
              [...filteredSessions].reverse().map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="text-base">{enquiry.name}</TableCell>
                  <TableCell className="text-base">
                    {enquiry.phoneNumber}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm flex items-center">
                        <Mail className="h-4 w-4 mr-1" /> {enquiry.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />{" "}
                        {format(enquiry.createdAt, "MMM dd, yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />{" "}
                        {format(enquiry.updatedAt, "MMM dd, yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-base">
                    {getStatusBadge(enquiry.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-base">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-base">
                          Update Status
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => updateStatus(enquiry.id, "PENDING")}
                          disabled={isUpdating === enquiry.id}
                          className="text-sm"
                        >
                          {isUpdating === enquiry.id ? (
                            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-yellow-500 rounded-full animate-spin"></div>
                          ) : (
                            <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                          )}
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatus(enquiry.id, "IN_PROGRESS")
                          }
                          disabled={isUpdating === enquiry.id}
                          className="text-sm"
                        >
                          {isUpdating === enquiry.id ? (
                            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                          ) : (
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          )}
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(enquiry.id, "RESOLVED")}
                          disabled={isUpdating === enquiry.id}
                          className="text-sm"
                        >
                          {isUpdating === enquiry.id ? (
                            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          )}
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(enquiry.id, "CLOSED")}
                          disabled={isUpdating === enquiry.id}
                          className="text-sm"
                        >
                          {isUpdating === enquiry.id ? (
                            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                          ) : (
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          )}
                          Mark as Closed
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
    </div>
  );
}
