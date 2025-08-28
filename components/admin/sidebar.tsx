"use client";

import {
  UserPlus,
  Calendar,
  Users,
  ListChecks,
  ClipboardList,
  PhoneCall,
  Home,
  PanelLeftClose,
  PanelRightOpen,
  FileText,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const navItems = [
  {
    value: "internship-enrollments",
    label: "Internship Enrollments",
    icon: ClipboardList,
  },
  { value: "status", label: "Status", icon: ListChecks },
  { value: "register", label: "Register", icon: UserPlus },
  { value: "sessions", label: "Attendees", icon: Calendar },
  { value: "book", label: "Book Demo", icon: Users },
  { value: "demo", label: "Demo Sessions", icon: Home },
  { value: "enquiry", label: "Enquiries", icon: PhoneCall },
  { value: "forms", label: "Forms", icon: FileText },
];

export function AdminSidebar({
  activeTab,
  setActiveTab,
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {

  const handleTabClick = (item: string) => {
    localStorage.setItem("currentTab", item);
    setActiveTab(item);
  }
  return (
    <aside
      className={`relative flex h-screen flex-col gap-2 bg-gray-900 p-3 text-white transition-all duration-300 ${
        isCollapsed ? "w-20 items-center" : "w-64 h-full"
      } ${className}`}
    >
      <div className="flex items-center justify-between p-4">
        <h1
          className={`text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent overflow-hidden transition-all duration-300 ${
            isCollapsed ? "w-0" : "w-auto"
          }`}
        >
          AstraTech
        </h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1 w-full">
        {navItems.map((item) => (
          <button
            key={item.value}
            onClick={() => handleTabClick(item.value)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-800 hover:text-cyan-400 ${
              activeTab === item.value
                ? "bg-gray-800 text-cyan-400"
                : "text-gray-400"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={item.label}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span
              className={`overflow-hidden transition-all ${
                isCollapsed ? "w-0" : "w-auto"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-800 hover:text-cyan-400 w-full ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <PanelRightOpen className="h-5 w-5 flex-shrink-0" />
          ) : (
            <PanelLeftClose className="h-5 w-5 flex-shrink-0" />
          )}
          <span
            className={`overflow-hidden transition-all ${
              isCollapsed ? "w-0" : "w-auto"
            }`}
          >
            {isCollapsed ? "" : "Collapse"}
          </span>
        </button>
      </div>
    </aside>
  );
}
