"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Enrollment {
  id: string;
  name?: string;
  collegeName?: string;
  interestedInternship?: string;
  collegeEmail?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  homeLocation?: string;
  currentLocation?: string;
  attendOffline?: string;
  certificationMode?: string;
  internshipPaymentStatus?: "PAID" | "UNPAID";
  created_at?: string;
}

export default function InternshipEnrollmentManagement() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEnrollments = async (isRefresh: boolean = false) => {
    if (isRefresh) {
      setLoading(true);
    }
    try {
      const res = await fetch("/api/admin/internship-enrollments");
      const data = await res.json();
      setEnrollments(data.enrollments || []);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to fetch enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    // eslint-disable-next-line
  }, []);

  const handlePaymentStatusChange = async (
    id: string,
    paymentStatus: "PAID" | "UNPAID"
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/internship-enrollments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }
      toast({ title: "✅ Success", description: "Payment status updated." });
      fetchEnrollments();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to update payment status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = () => {
    fetchEnrollments(true);
  };

  if (initialLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">
            Internship Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              <p className="text-gray-400">Loading enrollments...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg text-cyan-400">
          Internship Enrollments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-800 text-gray-400">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">College</th>
                  <th className="px-3 py-2">Internship</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">WhatsApp</th>
                  <th className="px-3 py-2">Home Location</th>
                  <th className="px-3 py-2">Current Location</th>
                  <th className="px-3 py-2">Attend Offline</th>
                  <th className="px-3 py-2">Certification Mode</th>
                  <th className="px-3 py-2">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-gray-400">No enrollments found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  enrollments.map((enr) => (
                    <tr
                      key={enr.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50"
                    >
                      <td className="px-3 py-2">{enr.name || "-"}</td>
                      <td className="px-3 py-2">{enr.collegeName || "-"}</td>
                      <td className="px-3 py-2">
                        {enr.interestedInternship || "-"}
                      </td>
                      <td className="px-3 py-2">{enr.collegeEmail || "-"}</td>
                      <td className="px-3 py-2">{enr.phoneNumber || "-"}</td>
                      <td className="px-3 py-2">{enr.whatsappNumber || "-"}</td>
                      <td className="px-3 py-2">{enr.homeLocation || "-"}</td>
                      <td className="px-3 py-2">
                        {enr.currentLocation || "-"}
                      </td>
                      <td className="px-3 py-2">{enr.attendOffline || "-"}</td>
                      <td className="px-3 py-2">
                        {enr.certificationMode || "-"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="relative">
                          <Select
                            value={enr.internshipPaymentStatus || "UNPAID"}
                            onValueChange={(val) =>
                              handlePaymentStatusChange(
                                enr.id,
                                val as "PAID" | "UNPAID"
                              )
                            }
                            disabled={updatingId === enr.id}
                          >
                            <SelectTrigger className="w-28 bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PAID">PAID</SelectItem>
                              <SelectItem value="UNPAID">UNPAID</SelectItem>
                            </SelectContent>
                          </Select>
                          {updatingId === enr.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-700/50 rounded">
                              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-gray-400">No enrollments found.</p>
              </div>
            </div>
          ) : (
            enrollments.map((enr) => (
              <Card
                key={enr.id}
                className="bg-gray-800 border-gray-700 shadow-sm"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">
                          {enr.name || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {enr.collegeName || "N/A"}
                        </p>
                      </div>
                      <div className="relative">
                        <Select
                          value={enr.internshipPaymentStatus || "UNPAID"}
                          onValueChange={(val) =>
                            handlePaymentStatusChange(
                              enr.id,
                              val as "PAID" | "UNPAID"
                            )
                          }
                          disabled={updatingId === enr.id}
                        >
                          <SelectTrigger className="w-24 bg-gray-700 border-gray-600 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PAID">PAID</SelectItem>
                            <SelectItem value="UNPAID">UNPAID</SelectItem>
                          </SelectContent>
                        </Select>
                        {updatingId === enr.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-700/50 rounded">
                            <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Internship:</span>
                        <p className="text-white truncate">
                          {enr.interestedInternship || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <p className="text-white truncate">
                          {enr.collegeEmail || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <p className="text-white">{enr.phoneNumber || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">WhatsApp:</span>
                        <p className="text-white">
                          {enr.whatsappNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Home Location:</span>
                        <p className="text-white">
                          {enr.homeLocation || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Current Location:</span>
                        <p className="text-white">
                          {enr.currentLocation || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Attend Offline:</span>
                        <p className="text-white">
                          {enr.attendOffline || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">
                          Certification Mode:
                        </span>
                        <p className="text-white">
                          {enr.certificationMode || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Loading overlay for refresh */}
        {loading && !initialLoading && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-lg">
            <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
              <span className="text-white">Updating...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
