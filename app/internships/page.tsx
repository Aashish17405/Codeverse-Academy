"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Download,
  Users,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
} from "lucide-react";

const WHATSAPP_LINK =
  "https://chat.whatsapp.com/EoWSjut30kvGKHwkVN5Ygv";

export default function InternshipPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden w-full">
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <a href="/" className="inline-block">
          <Button
            variant="ghost"
            className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 shadow hover:scale-105 hover:shadow-lg hover:bg-gray-800/90 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Button>
        </a>
      </div>
      <section className="max-w-4xl mx-auto py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 text-transparent bg-clip-text ">
            1-Month Free Web Dev & AI Internship
          </h1>
          <p className="text-lg text-gray-300 font-medium max-w-2xl mx-auto">
            •
            <span className="text-green-400 font-semibold">
              {" "}
              Only 30 seats in Jamshedpur
            </span>{" "}
            •
            <span className="text-red-400 font-semibold">
              {" "}
              Govt-registered certificate
            </span>
          </p>
          <div className="flex justify-center pt-4">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-8 py-4 text-lg rounded-xl border-2 border-green-400/50 min-w-[200px] transition-all duration-200 hover:scale-105 hover:shadow-lg hover:brightness-110"
              >
                Apply Now on WhatsApp
              </Button>
            </a>
          </div>
        </section>

        {/* Why Join & Program Details Section */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Why Join Card */}
          <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text flex items-center gap-2">
                <span>⭐</span> Why Join?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  icon: "💰",
                  title: "Zero Cost, High Impact",
                  desc: "No fees—gain real skills in Next.js, TailwindCSS & OpenAI APIs.",
                },
                {
                  icon: "🏆",
                  title: "Govt-Registered Certificate",
                  desc: "Boost your resume with an official credential.",
                },
                {
                  icon: "🛠️",
                  title: "Hands-On Projects",
                  desc: "Build and deploy two live mini-apps by month's end.",
                },
                {
                  icon: "🔥",
                  title: "Limited Seats",
                  desc: "30 spots—first-come, first-served.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                      {item.title}
                    </Badge>
                    <p className="text-sm text-gray-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Program Details Card */}
          <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text flex items-center gap-2">
                <span>📋</span> Program Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  icon: <Calendar className="w-5 h-5" />,
                  label: "Duration",
                  value: "30 days (June 25 – July 24, 2025)",
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: "Mode",
                  value: "Offline, Jamshedpur campus",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  label: "Intro Session",
                  value: "June 25, 2025 • 7 PM IST",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  label: "Timing",
                  value: "Mon–Sat • 6 PM–9 PM IST",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "Cohort Size",
                  value: "30 interns",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                >
                  <div className="text-purple-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-purple-300">
                      {item.label}:
                    </span>
                    <span className="ml-2 text-gray-300">{item.value}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Download Syllabus Section */}
        <section>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {[
              {
                title: "AI Tools Syllabus",
                filename: "AI_Tools_Integration_Syllabus.pdf",
                gradient: "from-orange-500 to-red-500",
              },
              {
                title: "Next.js Syllabus",
                filename: "Nextjs_3_Week_Syllabus.pdf",
                gradient: "from-green-500 to-teal-500",
              },
            ].map((item, index) => (
              <a
                key={index}
                href={`/${item.filename}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  className={`w-full bg-gradient-to-r ${item.gradient} text-white font-semibold py-3 px-6 rounded-xl border-2 border-white/20 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:brightness-110`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download {item.title} (PDF)
                </Button>
              </a>
            ))}
          </div>
        </section>

        {/* What You'll Learn Section */}
        <section>
          <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-gray-900/90 to-gray-800/90 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text flex items-center gap-2">
                <span>🎯</span> What You'll Learn
              </CardTitle>
              <CardDescription className="text-gray-300">
                Each week is packed with hands-on learning and real-world
                projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    week: 1,
                    topic: "Next.js App Router, TailwindCSS UI",
                    icon: "⚡",
                  },
                  {
                    week: 2,
                    topic: "API Integration with OpenAI & Zod validation",
                    icon: "🔗",
                  },
                  {
                    week: 3,
                    topic:
                      'Building AI "tools" (summarizer, hashtag generator)',
                    icon: "🤖",
                  },
                  {
                    week: 4,
                    topic: "Deployment on Vercel, CI/CD & polish",
                    icon: "🚀",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold">
                      {item.week}
                    </div>
                    <span className="text-2xl mr-2">{item.icon}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-emerald-300">
                        Week {item.week}:
                      </span>
                      <span className="ml-2 text-gray-300">{item.topic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* What You Get Section */}
        <section>
          <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text flex items-center gap-2">
                <span>🎁</span> What You Get
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Interactive Workshops every evening",
                  "1:1 Mentorship & code reviews",
                  "Project Showcase: Host your code on GitHub & Vercel",
                  "Exclusive Slack Group for networking & support",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                  >
                    <span className="text-green-400 text-xl">✅</span>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Who Should Apply & How to Apply */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Who Should Apply */}
          <Card className="h-full border-2 border-indigo-500/20 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-2">
                <span>👥</span> Who Should Apply
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Final-year students & fresh grads in CS/IT",
                "Self-taught developers keen on AI",
                "Startup enthusiasts & budding full-stack engineers",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
                >
                  <span className="text-indigo-400">•</span>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* How to Apply */}
          <Card className="h-full border-2 border-pink-500/20 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text flex items-center gap-2">
                <span>📝</span> How to Apply
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Click Apply Now to join our WhatsApp group.",
                "Fill out a short form (name, email, GitHub link).",
                "You'll receive a confirmation within 24 hrs.",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-300 flex-1">{item}</span>
                </div>
              ))}
              <div className="pt-4">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl border-2 border-green-400/50 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:brightness-110">
                    📱 Apply Now on WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            <span className="inline-block mr-2">❓</span> Frequently Asked
            Questions
          </h2>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                {
                  id: "q1",
                  question: "Do I need prior AI experience?",
                  answer: "No—just basic JavaScript skills.",
                },
                {
                  id: "q2",
                  question: "What if I miss a session?",
                  answer: "All workshops are recorded and shared.",
                },
                {
                  id: "q3",
                  question: "Is there any stipend?",
                  answer:
                    "No stipend, but priceless experience & certification.",
                },
              ].map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-2 border-gray-700/50 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 px-4"
                >
                  <AccordionTrigger className="text-left group py-4">
                    <span className="text-gray-200 group-hover:text-blue-300 transition-colors">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pb-4 pl-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </section>
      <Footer />
    </main>
  );
}
