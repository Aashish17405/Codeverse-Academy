import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Curriculum from "@/components/curriculum";
import Enrollment from "@/components/enrollment";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import EnrollmentPopup from "@/components/enrollment-popup";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden w-full">
      <Navbar />
      <Hero />
      <Features />
      <Curriculum />
      <Enrollment />
      <FAQ />
      <Footer />
      <EnrollmentPopup />
      <ScrollToTop />
    </main>
  );
}
