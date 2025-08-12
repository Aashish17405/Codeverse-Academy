"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, Menu } from "lucide-react";
import AdminRegistrationForm from "@/components/admin/admin-registration-form";
import AttendeeList from "@/components/admin/attendee-list";
import AdminDemoBookingForm from "@/components/admin/admin-demo-booking-form";
import StatusManagement from "@/components/admin/status-management";
import { useRouter } from "next/navigation";
import AdminDemoSessionManagement from "@/components/admin/admin-demo-management";
import EnquiryManagement from "@/components/admin/enquiry-management";
import InternshipEnrollmentManagement from "@/components/admin/internship-enrollment-management";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import FormsManagement from "@/components/admin/FormManagement";

const navItems = [
  { value: "internship-enrollments", label: "Internship Enrollments" },
  { value: "status", label: "Status" },
  { value: "register", label: "Register New Admin" },
  { value: "sessions", label: "Attendee Details" },
  { value: "book", label: "Book Demo Session" },
  { value: "demo", label: "Demo Sessions" },
  { value: "enquiry", label: "Enquiries" },
  { value: "forms", label: "Forms" },
];

function getTabTitle(tab: string) {
  const item = navItems.find((item) => item.value === tab);
  return item ? item.label : "Dashboard";
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("internship-enrollments");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set activeTab from localStorage after mount (client-side only)
    const storedTab =
      typeof window !== "undefined" ? localStorage.getItem("currentTab") : null;
    if (storedTab) setActiveTab(storedTab);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check-auth", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.push("/admin");
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

  const renderContent = () => {
    switch (activeTab) {
      case "internship-enrollments":
        return <InternshipEnrollmentManagement />;
      case "status":
        return <StatusManagement />;
      case "register":
        return (
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">
                Register New Admin
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                Create a new admin account with appropriate permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminRegistrationForm />
            </CardContent>
          </Card>
        );
      case "sessions":
        return (
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">
                Attendee Details
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                View and manage attendee details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendeeList />
            </CardContent>
          </Card>
        );
      case "book":
        return (
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">
                Book Demo Session
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                Schedule a new demo session for attendees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminDemoBookingForm />
            </CardContent>
          </Card>
        );
      case "demo":
        return <AdminDemoSessionManagement />;
      case "enquiry":
        return <EnquiryManagement />;
      case "forms":
        return <FormsManagement />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`grid min-h-screen w-full bg-gray-950 transition-all duration-300 ${
        isSidebarCollapsed
          ? "md:grid-cols-[80px_1fr]"
          : "md:grid-cols-[280px_1fr]"
      }`}
    >
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className="hidden md:flex"
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <div className="flex flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden flex items-center justify-center text-gray-300 hover:text-white"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-gray-900 p-0 w-auto">
                  <AdminSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={false}
                    setIsCollapsed={() => {}}
                  />
                </SheetContent>
              </Sheet>
              <h1 className="text-xl md:text-2xl font-semibold text-white">
                {getTabTitle(activeTab)}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoggingOut}
              className="text-gray-300 hover:text-white hover:bg-gray-800 h-9 w-9"
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
                <div className="h-5 w-5 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              <span className="sr-only">Logout</span>
            </Button>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
