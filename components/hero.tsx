"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { DemoBookingForm } from "@/components/demo-booking-form";

export default function Hero() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="pt-32 pb-20 md:pt-16 md:pb-28 relative overflow-hidden w-full">
      {/* Background video */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10"></div>
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/856787-hd_1920_1080_30fps-rpqctzI6rNppucnFPieml38m9hiToU.mp4"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center max-w-4xl mx-auto w-full"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="inline-block px-3 sm:px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 text-xs sm:text-base font-bold mb-4 border-2 border-yellow-500/40 shadow-lg shadow-yellow-500/20 animate-pulse">
              <Users className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-300" />
              ⚠️ Limited Seats: Only 30 students per batch! ⚠️
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent leading-tight md:leading-tight pb-1 px-2"
          >
            Master Cutting-Edge Technology in Just 5 Months
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-lg text-gray-300 mb-8 max-w-3xl mx-auto px-2"
          >
            Our intensive program combines hands-on projects, expert mentorship,
            and industry-relevant skills to transform you into a tech
            professional ready for the future.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-2"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/30 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
              asChild
            >
              <Link href="#curriculum">View Curriculum</Link>
            </Button>

            <DemoBookingForm>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-base sm:text-lg px-6 sm:px-6 w-full sm:w-auto">
                Reserve Your Spot
              </Button>
            </DemoBookingForm>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto px-2"
          >
            {[
              { label: "Duration", value: "5 Months" },
              { label: "Projects", value: "12+" },
              { label: "Mentors", value: "Industry Experts" },
              { label: "Job Assistance", value: "100%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-gray-700/50"
              >
                <div className="text-gray-400 text-xs sm:text-sm mb-1">
                  {stat.label}
                </div>
                <div className="text-white text-sm sm:text-base font-semibold">
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
