"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Edit, Trash2, Plus, Loader2 } from "lucide-react";

interface DemoSession {
  date: string;
  courseName: string;
  capacity: number;
  ticketCount: number;
  updatedAt: string;
  id: string;
}

export default function AdminDemoSessionManagement() {
  const [sessions, setSessions] = useState<DemoSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Create session state
  const [createLoading, setCreateLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    date: "",
    capacity: 30,
    courseName: "",
  });

  // Update session state
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [sessionToUpdate, setSessionToUpdate] = useState<DemoSession | null>(
    null
  );
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    date: "",
    capacity: 0,
  });

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const res = await fetch("/api/admin/sessions");
      const data = await res.json();

      if (Array.isArray(data)) {
        const normalizedData = data.map((session: any) => ({
          date: session.date,
          courseName: session.courseName,
          capacity: session.capacity,
          ticketCount: session.ticketCount,
          updatedAt: session.updatedAt,
          id: session.id,
        }));
        setSessions(normalizedData);
        // console.log("Available sessions:", normalizedData);
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
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getAvailableSpots = (capacity: number, ticketCount: number) => {
    return capacity - ticketCount;
  };

  const getStatusColor = (capacity: number, ticketCount: number) => {
    const available = getAvailableSpots(capacity, ticketCount);
    if (available === 0) return "text-red-600 bg-red-50";
    if (available <= 5) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/sessions/${sessionToDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Demo session deleted successfully");
        setSessions(
          sessions.filter((session) => session.id !== sessionToDelete)
        );
      } else {
        toast.error(data.error || "Failed to delete demo session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("An error occurred while deleting the session");
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setSessionToDelete(null);
  };

  const handleUpdateClick = (session: DemoSession) => {
    setSessionToUpdate(session);
    // Format date for input field (YYYY-MM-DD)
    const dateObj = new Date(session.date);
    const formattedDate = dateObj.toISOString().split("T")[0];

    setUpdateFormData({
      date: formattedDate,
      capacity: session.capacity,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateCancel = () => {
    setUpdateModalOpen(false);
    setSessionToUpdate(null);
    setUpdateFormData({ date: "", capacity: 0 });
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    });
  };

  const handleCreateCancel = () => {
    setCreateFormData({
      date: "",
      capacity: 30,
      courseName: "",
    });
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateFormData({
      ...createFormData,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setCreateLoading(true);
    try {
      const response = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: createFormData.date,
          capacity: createFormData.capacity,
          courseName: createFormData.courseName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Demo session created successfully");

        if (data.session) {
          setSessions([
            ...sessions,
            {
              id: data.session.id,
              date: data.session.date,
              courseName: data.session.courseName,
              capacity: data.session.capacity,
              ticketCount: 0,
              updatedAt: data.session.updatedAt,
            },
          ]);
        }

        setCreateFormData({
          date: "",
          capacity: 30,
          courseName: "",
        });
      } else {
        toast.error(data.error || "Failed to create demo session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("An error occurred while creating the session");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionToUpdate) return;

    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/admin/sessions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: sessionToUpdate.id,
          date: updateFormData.date,
          capacity: updateFormData.capacity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Demo session updated successfully");

        setSessions(
          sessions.map((session) =>
            session.id === sessionToUpdate.id
              ? {
                  ...session,
                  date: data.session.date,
                  capacity: data.session.capacity,
                  updatedAt: data.session.updatedAt,
                  ticketCount: data.session.ticketCount,
                }
              : session
          )
        );

        setUpdateModalOpen(false);
        setSessionToUpdate(null);
      } else {
        toast.error(data.error || "Failed to update demo session");
      }
    } catch (error) {
      console.error("Error updating session:", error);
      toast.error("An error occurred while updating the session");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="p-3 space-y-6">
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-cyan-400 flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create New Demo Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="create-date"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  id="create-date"
                  name="date"
                  value={createFormData.date}
                  onChange={handleCreateChange}
                  className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-gray-200"
                  required
                />
              </div>
            </div>

            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="create-courseName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Course Name
              </label>
              <input
                type="text"
                id="create-courseName"
                name="courseName"
                value={createFormData.courseName}
                onChange={handleCreateChange}
                placeholder="e.g. Introduction to Programming"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-gray-200"
                required
              />
            </div>

            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="create-capacity"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Capacity
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  id="create-capacity"
                  name="capacity"
                  min="1"
                  value={createFormData.capacity}
                  onChange={handleCreateChange}
                  className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-gray-200"
                  required
                />
              </div>
            </div>

            <div className="flex items-end space-x-3 ml-auto mt-4 w-full sm:w-auto">
              <Button
                type="button"
                onClick={handleCreateCancel}
                variant="outline"
                className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                disabled={createLoading}
              >
                {createLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Session
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl text-cyan-400">
            Demo Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-cyan-500" />
              <span className="ml-3 text-gray-400 text-sm sm:text-base">
                Loading sessions...
              </span>
            </div>
          ) : (
            <div className="rounded-md border border-gray-700 overflow-hidden">
              {sessions.length === 0 ? (
                <div className="text-center py-12 bg-gray-800">
                  <p className="text-gray-400 text-sm sm:text-base">
                    No demo sessions found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                          Course Name
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Capacity
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                          Booked
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Available
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                          Last Updated
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {sessions.map((session, index) => {
                        const availableSpots = getAvailableSpots(
                          session.capacity,
                          session.ticketCount
                        );
                        const statusColor = getStatusColor(
                          session.capacity,
                          session.ticketCount
                        );

                        return (
                          <tr key={index} className="hover:bg-gray-750">
                            <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                              <div className="flex flex-col">
                                <span className="text-gray-200 flex items-center">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-cyan-400" />
                                  {formatDate(session.date)}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-xs sm:text-sm font-medium text-gray-200">
                                {session.courseName}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-200">
                              {session.capacity}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-200 hidden sm:table-cell">
                              {session.ticketCount}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                {availableSpots} spots
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400 hidden lg:table-cell">
                              {formatDate(session.updatedAt)}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white h-7 sm:h-8 px-2 sm:px-3"
                                  onClick={() => handleUpdateClick(session)}
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                  <span className="hidden sm:inline">
                                    Update
                                  </span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700 h-7 sm:h-8 px-2 sm:px-3"
                                  onClick={() => handleDeleteClick(session.id)}
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                  <span className="hidden sm:inline">
                                    Delete
                                  </span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {sessions.length > 0 && (
            <div className="mt-4 text-xs sm:text-sm text-gray-400">
              Showing {sessions.length} demo session
              {sessions.length !== 1 ? "s" : ""}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 max-w-md w-full border border-gray-700 shadow-xl">
            <h3 className="text-base sm:text-lg font-medium text-cyan-400 mb-3 sm:mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              Are you sure you want to delete this demo session? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                className="text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="text-xs sm:text-sm"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateModalOpen && sessionToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-700 shadow-xl">
            <h3 className="text-lg font-medium text-cyan-400 mb-4">
              Update Demo Session
            </h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={updateFormData.date}
                    onChange={handleUpdateChange}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-gray-200"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Capacity
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    value={updateFormData.capacity}
                    onChange={handleUpdateChange}
                    className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-gray-200"
                    required
                  />
                </div>
                {sessionToUpdate.ticketCount > updateFormData.capacity && (
                  <p className="mt-1 text-sm text-red-400">
                    Warning: New capacity is less than current bookings (
                    {sessionToUpdate.ticketCount})
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  onClick={handleUpdateCancel}
                  variant="outline"
                  className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                  disabled={updateLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center justify-center"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Session
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
