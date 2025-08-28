"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { RippleButton } from "@/components/ui/ripple-button";
import EnrollmentPopup from "@/components/enrollment-popup";
import EnrollmentPopup2 from "@/components/enrollment-popup2";
import { useState, useEffect } from "react";
import { VideoPopup } from "@/components/video-popup";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface Matter {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface TicketInfo {
  courseName: string;
  capacity: number;
  ticketCount: number;
  date: string;
  id: string;
  timeSlot?: string;
}

interface TicketData {
  id: string;
  date: string;
  courseName: string;
  capacity: number;
  ticketCount: number;
  timeSlot?: string;
}
function Card({ matter }: { matter: Matter }) {
  return (
    <div className="space-y-2 p-4 sm:p-6">
      <p className="text-sm font-medium text-gray-400 tracking-wide">
        {matter.title}
      </p>
      <h2 className="text-xl font-bold text-white">{matter.subtitle}</h2>
      <div className="w-full relative aspect-[3/2]">
        <Image
          src={matter.image}
          alt={matter.title}
          fill
          className="object-contain rounded-lg"
        />
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">
        {matter.description}
      </p>
    </div>
  );
}

export default function Hero() {
  const [showEnrollmentPopup, setShowEnrollmentPopup] = useState(false);
  const [showEnrollmentPopup2, setShowEnrollmentPopup2] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<TicketInfo[]>([]);
  const [nextSessionInfo, setNextSessionInfo] = useState<TicketInfo | null>(
    null
  );
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [demoSessionTimer, setDemoSessionTimer] = useState<number | null>(null);
  const [isCurrentSessionFull, setIsCurrentSessionFull] = useState(false);

  async function fetchTicketData() {
    try {
      setLoadingCourses(true);
      const response = await fetch("/api/sessions");
      const data = await response.json();

      const demoSessions = data;

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
        setTicketInfo([currentSession]);
        console.log(currentSession);

        const isCurrentFull =
          currentSession.ticketCount >= currentSession.capacity;
        setIsCurrentSessionFull(isCurrentFull);

        if (isCurrentFull && upcomingSessions.length > 1) {
          const nextAvailableSession = upcomingSessions
            .slice(1)
            .find(
              (session: TicketData) => session.ticketCount < session.capacity
            );

          if (nextAvailableSession) {
            setNextSessionInfo(nextAvailableSession);
          } else {
            setNextSessionInfo(upcomingSessions[1]);
          }
        } else if (upcomingSessions.length > 1) {
          setNextSessionInfo(upcomingSessions[1]);
        }

        const sessionTime = new Date(currentSession.date).getTime();
        const timeRemaining = sessionTime - now;

        if (timeRemaining > 0) {
          setDemoSessionTimer(Math.floor(timeRemaining / 1000));
          localStorage.setItem(
            "demoSessionTimer",
            Math.floor(timeRemaining / 1000).toString()
          );
          localStorage.setItem("demoSessionId", currentSession.id);
        }
      } else if (demoSessions.length > 0) {
        setTicketInfo([demoSessions[demoSessions.length - 1]]);
        console.log(demoSessions[demoSessions.length - 1]);
      }
    } catch (e) {
      toast.error("Error fetching ticket data");
      console.error(e);
    } finally {
      setLoadingCourses(false);
    }
  }

  function formatTimeSlot(dateString: string, timeSlot?: string) {
    if (timeSlot) return timeSlot;

    const date = new Date(dateString);
    const startHour = date.getHours();
    const startMinute = date.getMinutes();
    const endHour = (startHour + 2) % 24;

    const formatTime = (hour: number, minute: number) => {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
    };

    return `${formatTime(startHour, startMinute)} - ${formatTime(
      endHour,
      startMinute
    )}`;
  }

  useEffect(() => {
    try {
      fetchTicketData();
    } catch (e) {
      toast.error("Error fetching ticket data");
      console.error(e);
    }
  }, [showEnrollmentPopup]);

  useEffect(() => {
    if (demoSessionTimer === null) return;

    const timerInterval = setInterval(() => {
      setDemoSessionTimer((prevTimer) => {
        if (prevTimer === null || prevTimer <= 0) {
          clearInterval(timerInterval);
          return 0;
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

  const formatCourseName = (name: string) =>
    name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const matter: Matter[] = [
    {
      title: "LEARN",
      subtitle: "Practical Offline Lessons",
      image: "/learn.png",
      description:
        "Gain a strong foundation in AI, MERN stack, and blockchain through hands-on offline lessons designed to build real-world tech expertise.",
    },
    {
      title: "PRACTICE",
      subtitle: "Internships",
      image: "/internship.png",
      description:
        "Apply your skills in live projects and structured internships, gaining industry experience and mentorship to refine your knowledge.",
    },
    {
      title: "ACHIEVE",
      subtitle: "Job Assistance",
      image: "/placement.png",
      description:
        "Boost your career with expert job placement support, networking opportunities, and guidance tailored to help you land tech roles.",
    },
  ];

  return (
    <div>
      <div className="relative text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.gif"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/90 to-[#0f172a]/80 md:to-transparent z-10" />

          <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-transparent z-5 overflow-hidden">
            <div className="absolute inset-0 bg-transparent border border-gray-500/20 rounded-full" />
          </div>
        </div>

        <div className="relative z-20 py-8 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 min-h-[40vh] md:min-h-[50vh]">
            <div className="w-full md:flex-1 space-y-3 md:space-y-4 order-1">
              <p className="text-sm md:text-md font-medium text-gray-300">
                TRANSFORM YOUR CAREER
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-4xl font-playfair font-bold leading-tight">
                Master AI, MERN & Blockchain
              </h1>
              <p className="text-gray-300 text-base max-w-xl">
                Join our industry-leading program and become a full-stack
                developer. Learn from experts, build real projects, and launch
                your tech career.
              </p>

              <div className="relative block md:hidden w-full h-48 my-6 rounded-lg overflow-hidden">
                <Image
                  src="/background.gif"
                  alt="Course preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />

                {/* Mobile video "trailer" button centered on the GIF */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <RippleButton
                    onClick={() => setShowVideoPopup(true)}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-md 
                    text-white font-semibold transition-all duration-300 hover:bg-white/20"
                  >
                    <span className="absolute animate-ripple inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full" />
                    <span className="z-10">Watch trailer</span>
                    <img
                      src="/play.png"
                      width={15}
                      height={15}
                      className="z-10"
                      alt="Play icon"
                    />
                  </RippleButton>
                </div>
              </div>

              {loadingCourses ? (
                <div className="text-sm text-gray-300 text-center px-4 py-3 animate-pulse italic">
                  🔍 Gathering availability... Your dream session is on its way.
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {ticketInfo.length > 0 && (
                    <motion.div
                      key={ticketInfo[0]?.id || "no-sessions"}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="bg-[#0f172a]/70 border border-white/10 backdrop-blur-sm rounded-xl pl-4 py-3 text-white shadow-inner"
                    >
                      {/* Desktop Layout (3 columns) - Fixed spacing */}
                      <div className="hidden sm:flex items-center gap-3">
                        {/* Course name - Limited width */}
                        <div className="w-2/5">
                          <p className="text-xs text-blue-300 font-semibold tracking-wide">
                            Upcoming Demo Session
                          </p>
                          <p className="text-lg font-bold text-white mt-1 truncate">
                            {ticketInfo[0]?.courseName
                              ? formatCourseName(ticketInfo[0].courseName)
                              : "Sunday Demo Session"}
                          </p>
                        </div>

                        <div className="w-1/5 text-center">
                          <p className="text-xs text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)] font-semibold tracking-wide">
                            Seats left
                          </p>
                          <p className="text-2xl font-extrabold text-yellow-400 mt-1 drop-shadow-sm">
                            {ticketInfo[0]
                              ? ticketInfo[0].capacity -
                                ticketInfo[0].ticketCount
                              : "-"}
                          </p>
                        </div>

                        {ticketInfo[0] &&
                          demoSessionTimer !== null &&
                          demoSessionTimer > 0 && (
                            <div className="w-2/5">
                              <p className="text-xs text-blue-300 font-semibold text-center mb-1">
                                Time remaining
                              </p>
                              <div className="flex justify-center space-x-2">
                                {getTimerUnits(demoSessionTimer).map(
                                  (unit, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col items-center"
                                    >
                                      <div className="bg-black/30 px-2 py-1 rounded text-sm font-mono text-white">
                                        {unit.value}
                                      </div>
                                      <span className="text-[9px] text-blue-300 mt-0.5">
                                        {unit.label}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Mobile Layout (2-rows) */}
                      <div className="sm:hidden">
                        {/* First row: Course name */}
                        <div className="mb-3">
                          <p className="text-xs text-blue-300 font-semibold tracking-wide">
                            Upcoming Demo Session
                          </p>
                          <p className="text-lg font-bold text-white mt-1">
                            {ticketInfo[0]?.courseName
                              ? formatCourseName(ticketInfo[0].courseName)
                              : "Sunday Demo Session"}
                          </p>
                        </div>

                        {/* Second row: Seats left and Timer side by side */}
                        <div className="flex items-center justify-between">
                          <div className="flex-shrink-0 text-center">
                            <p className="text-xs text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)] font-semibold tracking-wide">
                              Seats left
                            </p>
                            <p className="text-2xl font-extrabold text-yellow-400 mt-1 drop-shadow-sm">
                              {ticketInfo[0]
                                ? ticketInfo[0].capacity -
                                  ticketInfo[0].ticketCount
                                : "-"}
                            </p>
                          </div>

                          {ticketInfo[0] &&
                            demoSessionTimer !== null &&
                            demoSessionTimer > 0 && (
                              <div className="flex-shrink-0">
                                <p className="text-xs text-blue-300 font-semibold text-center mb-1">
                                  Time remaining
                                </p>
                                <div className="flex space-x-1">
                                  {getTimerUnits(demoSessionTimer).map(
                                    (unit, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col items-center"
                                      >
                                        <div className="bg-black/30 px-1 py-1 rounded text-xs font-mono text-white">
                                          {unit.value}
                                        </div>
                                        <span className="text-[8px] text-blue-300 mt-0.5">
                                          {unit.label}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {isCurrentSessionFull && nextSessionInfo && (
                <div className="bg-amber-500/20 border border-amber-400/30 px-4 py-3 rounded-lg text-white">
                  <p className="text-sm">
                    <span className="font-semibold">
                      Our upcoming session is now full due to overwhelming
                      interest.
                    </span>{" "}
                    We've opened registration for our next session on{" "}
                    {formatDate(nextSessionInfo.date)}{" "}
                    {nextSessionInfo.timeSlot || "4:00 PM - 6:00 PM"}.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 md:gap-4 pt-3">
                <button
                  onClick={() => setShowEnrollmentPopup(true)}
                  className="w-full sm:w-auto bg-yellow-400 text-black px-6 md:px-8 py-2 md:py-3 rounded-md font-semibold hover:bg-yellow-300 transition"
                >
                  Book a free demo
                </button>
                <button
                  onClick={() => setShowEnrollmentPopup2(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-2 md:py-3 border border-gray-500 rounded-md hover:bg-gray-700/50 transition backdrop-blur-sm"
                >
                  <Download size={16} />
                  <span>Download the brochure</span>
                </button>
              </div>

              {ticketInfo.length > 0 && (
                <p className="text-sm mt-1 text-blue-300">
                  Upcoming Demo Session:{" "}
                  {new Date(ticketInfo[0].date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  - {formatTimeSlot(ticketInfo[0].date, ticketInfo[0].timeSlot)}
                </p>
              )}
            </div>

            <div className="hidden md:flex flex-1 relative h-[400px] lg:h-[500px] items-center justify-center order-2">
              <div className="absolute z-30 flex items-center justify-center">
                <RippleButton
                  onClick={() => setShowVideoPopup(true)}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-md 
                  text-white font-semibold transition-all duration-300 hover:bg-white/20"
                >
                  <span className="absolute animate-ripple inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full" />
                  <span className="z-10">Watch trailer</span>
                  <img
                    src="/play.png"
                    width={15}
                    height={15}
                    className="z-10"
                    alt="Play icon"
                  />
                </RippleButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] text-white py-8 md:py-16 w-full">
        <div className="px-4 md:px-6 lg:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
            {matter.map((item, index) => (
              <Card key={index} matter={item} />
            ))}
          </div>
        </div>
      </div>

      <VideoPopup
        isVisible={showVideoPopup}
        onClose={() => setShowVideoPopup(false)}
        videoUrl="https://youtu.be/0tZFQs7qBfQ?si=SrHCkw9eFYKCBFsN"
      />

      <EnrollmentPopup
        initialVisible={showEnrollmentPopup}
        onClose={() => setShowEnrollmentPopup(false)}
      />

      <EnrollmentPopup2
        initialVisible={showEnrollmentPopup2}
        onClose={() => setShowEnrollmentPopup2(false)}
      />
    </div>
  );
}