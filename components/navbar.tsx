"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";
import { DemoBookingForm } from "@/components/demo-booking-form";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative z-40 transition-all duration-300 w-full ${
        isScrolled
          ? "bg-gray-900/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between w-full">
        <Link href="/" className="flex items-center space-x-2 ">
          <img
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="sm:w-10 sm:h-10 rounded-lg"
          />
          <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CodeVerse Academy
          </span>
        </Link>

        {isMobile ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-md hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        ) : (
          <nav className="flex items-center space-x-4 lg:space-x-8">
            <Link
              href="#features"
              className="text-sm lg:text-base text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#curriculum"
              className="text-sm lg:text-base text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Curriculum
            </Link>
            <Link
              href="#enrollment"
              className="text-sm lg:text-base text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Enrollment
            </Link>
            <Link
              href="#faq"
              className="text-sm lg:text-base text-gray-300 hover:text-cyan-400 transition-colors"
            >
              FAQ
            </Link>
            <a
              href="/brochure.pdf"
              download
              className="flex items-center text-sm lg:text-base text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <Download size={16} className="mr-1" />
              Brochure
            </a>
          </nav>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="absolute inset-x-0 top-full bg-gray-900 z-40 p-4 overflow-y-auto shadow-lg"
        >
          <nav className="flex flex-col space-y-6 pt-6">
            <Link
              href="#features"
              className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              href="#curriculum"
              className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              onClick={toggleMenu}
            >
              Curriculum
            </Link>
            <Link
              href="#enrollment"
              className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              onClick={toggleMenu}
            >
              Enrollment
            </Link>
            <Link
              href="#faq"
              className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              onClick={toggleMenu}
            >
              FAQ
            </Link>
            <a
              href="/brochure.pdf"
              download
              className="flex items-center text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              onClick={toggleMenu}
            >
              <Download size={20} className="mr-2" />
              Download Brochure
            </a>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
