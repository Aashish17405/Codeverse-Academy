import { useState, useEffect } from "react";
import { toast } from "sonner";

interface TicketData {
  id: string;
  date: string;
  courseName: string;
  capacity: number;
  ticketCount: number;
  timeSlot?: string;
}

export default function MobileTimer() {
  const [demoSessionTimer, setDemoSessionTimer] = useState<number | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function fetchTicketData() {
    try {
      setLoadingCourses(true);
      const response = await fetch("/api/sessions");
      const data = await response.json();

      const demoSessions = data.filter(
        (session: TicketData) =>
          session.courseName.toLowerCase() === "intro session" ||
          session.courseName === ""
      );

      demoSessions.sort(
        (a: TicketData, b: TicketData) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const now = new Date().getTime();
      const upcomingSessions = demoSessions.filter(
        (session: TicketData) => new Date(session.date).getTime() > now
      );

      if (upcomingSessions.length > 0) {
        const currentSession = upcomingSessions[0];
        const sessionTime = new Date(currentSession.date).getTime();
        const timeRemaining = sessionTime - now;

        if (timeRemaining > 0) {
          setDemoSessionTimer(Math.floor(timeRemaining / 1000));
          localStorage.setItem(
            "demoSessionTimer",
            Math.floor(timeRemaining / 1000).toString()
          );
          localStorage.setItem("demoSessionId", currentSession.id);
        } else {
          setDemoSessionTimer(null);
          setSessionId(null);
        }
      } else {
        setDemoSessionTimer(null);
        setSessionId(null);
      }
    } catch (e) {
      console.error("Error fetching ticket data:", e);
      toast.error("Error fetching ticket data");
      setDemoSessionTimer(null);
      setSessionId(null);
    } finally {
      setLoadingCourses(false);
    }
  }

  useEffect(() => {
    fetchTicketData();
    const interval = setInterval(fetchTicketData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (demoSessionTimer === null) return;

    const timerInterval = setInterval(() => {
      setDemoSessionTimer((prevTimer) => {
        if (prevTimer === null || prevTimer <= 0) {
          clearInterval(timerInterval);
          fetchTicketData(); // Fetch new data when timer reaches 0
          return null;
        }

        const newTimer = prevTimer - 1;
        localStorage.setItem("demoSessionTimer", newTimer.toString());
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [demoSessionTimer]);

  const getTimerUnits = (seconds: number) => {
    if (seconds <= 0) return [];

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      { value: hours.toString().padStart(2, "0"), label: "HRS" },
      { value: minutes.toString().padStart(2, "0"), label: "MIN" },
      { value: secs.toString().padStart(2, "0"), label: "SEC" },
    ];
  };

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 w-full transition-all duration-500 z-50 ${
        isScrolled ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 py-2 rounded-t-xl shadow-lg border-t-2 border-cyan-400">
        {loadingCourses ? (
          <div className="text-center py-2">
            <span className="text-gray-300 flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading upcoming sessions...
            </span>
          </div>
        ) : demoSessionTimer !== null && demoSessionTimer > 0 ? (
          <div className="flex flex-col items-center">
            <div className="mb-2 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold text-sm">
                Hurry Up! Mark your Calendar
              </span>
              <div className="text-xs font-light opacity-90 text-gray-300">
                Don't miss this opportunity!
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1">
              {getTimerUnits(demoSessionTimer).map((unit, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-gray-800 text-cyan-400 px-3 py-2 rounded-md text-lg font-bold shadow-inner border border-gray-700">
                    {unit.value}
                  </div>
                  <span className="text-xs mt-1 font-light text-gray-400">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <span className="text-gray-300">
              No upcoming sessions available
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
