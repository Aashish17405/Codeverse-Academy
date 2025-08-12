"use client";
import Navbar from "@/components/navbar";
import Features from "@/components/features";
import Curriculum from "@/components/curriculum";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import EnrollmentPopup from "@/components/enrollment-popup";
import { ScrollToTop } from "@/components/scroll-to-top";
import Hero from "@/components/hero";
import Testimonials from "@/components/testimonials";
import MobileTimer from "@/components/mobileTimer";

export default function Home(){
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden w-full">
      <Navbar />
      <Hero />
      <Features />
      <Curriculum />
      <Testimonials />
      <FAQ />
      <Footer />
      <EnrollmentPopup />
      <ScrollToTop />
      <MobileTimer />
    </main>
  );
}
