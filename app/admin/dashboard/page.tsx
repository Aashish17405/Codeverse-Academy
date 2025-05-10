"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, Users, LogOut, ListChecks } from "lucide-react";
import AdminRegistrationForm from "@/components/admin/admin-registration-form";
import DemoSessionsList from "@/components/admin/demo-sessions-list";
import AdminDemoBookingForm from "@/components/admin/admin-demo-booking-form";
import StatusManagement from "@/components/admin/status-management";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication by making a request to a protected endpoint
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check-auth", {
          method: "GET",
          credentials: "include", // Important: include cookies in the request
        });

        if (response.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.push("/admin"); // redirect to login
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthenticated(false);
        router.push("/admin");
      }
    };

    checkAuth();
  }, [router]);

  if (authenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Codeverse Admin
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoggingOut}
              onClick={async () => {
                try {
                  setIsLoggingOut(true);
                  const res = await fetch("/api/admin/logout", {
                    method: "POST",
                    credentials: "include",
                  });

                  if (res.ok) {
                    router.push("/");
                  }
                } catch (error) {
                  console.error("Logout failed:", error);
                  setIsLoggingOut(false);
                }
              }}
            >
              {isLoggingOut ? (
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="status" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span className="hidden sm:inline">Status Management</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Register Admin</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Demo Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="book" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Book Demo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <StatusManagement />
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register New Admin</CardTitle>
                <CardDescription>
                  Create a new admin account with appropriate permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRegistrationForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Demo Sessions</CardTitle>
                <CardDescription>
                  View and manage all scheduled demo sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DemoSessionsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="book">
            <Card>
              <CardHeader>
                <CardTitle>Book Demo for Candidate</CardTitle>
                <CardDescription>
                  Schedule a demo class for a prospective student.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminDemoBookingForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
