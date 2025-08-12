"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, Clock, Video, CheckCircle, X, Quote, Play } from "lucide-react"
import Link from "next/link"

export default function WorkshopLandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 4,
    minutes: 5,
    seconds: 20,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const testimonials = [
    {
      name: "Dr Asleshah Edala",
      title: "Women Empowerment Coach",
      company: "Founder Digital Mahila Shakti Padham",
      quote:
        "I had a very strong offline presence but was not sure about how to scale online. Manjunath and his team has helped us set the right strategy and achieve 1 Crore revenue in Just 55 Days. With right team you can scale the business very quickly.",
      highlight: "1 Crore revenue in Just 55 Days",
    },
    {
      name: "Siddharth Rajsekar",
      title: "Founder: Internet Lifestyle Hub",
      quote:
        "I have known Manjunath for many years now and have recommended many coaches to his services. His core ethics and values are in alignment. His customer first centric approach and delivering value to win their trust and help them get results stands out.",
    },
    {
      name: "Ranveer & Nachiketh",
      title: "COO. BeerBiceps Media",
      company: "Youtube & Podcast Growth Coach",
      quote:
        "We reached out to Manjunath for our Facebook ad efforts for the podcasting course @ BeerBiceps. The experience is amazing and we are getting very good results. The VSL Funnel they have setup is giving us consistent good results.",
    },
  ]

  const dayContent = [
    {
      day: "Day 1",
      title: "The Mindset Of Crore Champion Coaches",
      subtitle: "Before they make a crore, they train their minds to hold it.",
      points: [
        "How Crore Champions prepare themselves for both risk and reward",
        "How they gain crystal-clear clarity on their audience's deepest needs",
        "How they embrace marketing as a responsibility, not a discomfort",
        "The Inner Game Reset – Overcoming fear, rejection, and anxiety",
        "How they activate consistency, focus, and accountability",
      ],
    },
    {
      day: "Day 2",
      title: "The Language Of Crore Champion Coaches",
      subtitle: "Words don't just sell—they hypnotize, attract, and convert at scale.",
      points: [
        "The hidden power of words – Why copywriting creates a hypnotic effect",
        "The 7 Core Copywriting Frameworks used by Crore Champions",
        "How to create Magnetic Ads that stop scroll and spark buying intent",
        "The Presentation Flow that converts like crazy",
        "High-Ticket Conversion Secrets used by the top 1%",
      ],
    },
    {
      day: "Day 3",
      title: "The Mathematics Of Crore Champion Coaches",
      subtitle: "It's not magic. It's math, margin, and mastery over numbers.",
      points: [
        "The Law of Averages and Law of Large Numbers",
        "How to reverse-engineer your revenue using investment-to-return predictions",
        "KPI Mastery – The 8 Metrics You Must Track Weekly",
        "How Crore Coaches set and monitor growth-focused goals",
        "Scaling With Systems – Using numbers to scale predictably",
      ],
    },
  ]

  const mistakes = [
    { title: "Cost of Delay", icon: "💰" },
    { title: "Not Investing in Branding", icon: "🎨" },
    { title: "Poor Copywriting & Sales Skills", icon: "✍️" },
    { title: "Fear of Marketing = Bad Leads", icon: "📱" },
    { title: "No Lead Nurturing System", icon: "🔄" },
    { title: "Not Playing the Probability Game", icon: "📊" },
  ]

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="text-white font-bold text-2xl">TH</div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-orange-400">Targethub Presents</h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">3 day workshop for digital coaches</h2>
          </div>

          <div className="max-w-4xl mx-auto text-center mb-8">
            <h3 className="text-2xl md:text-4xl font-bold mb-4">
              <span className="text-orange-400">🔐 Crore Champion Secrets Revealed</span>
            </h3>
            <p className="text-xl md:text-2xl mb-8">
              Most Coaches Quit Because They Can't Figure Out the Funnels, Automation & Ads. We Make Sure You Don't.
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative aspect-video bg-slate-700 rounded-2xl border-4 border-orange-400 flex items-center justify-center">
              <Play className="w-16 h-16 text-white/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
            </div>
          </div>

          <p className="text-center text-lg mb-8 max-w-3xl mx-auto text-orange-300">
            (This success secret is not revealed by any coach for free. You won't find this on YouTube or any social
            media.)
          </p>

          {/* Instructor Info */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 bg-orange-500 rounded-full border-4 border-white"></div>
            </div>
            <div className="text-center md:text-left bg-slate-700 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-2 text-orange-400">Manjunath Nagaraja</h3>
              <p className="text-lg mb-4">
                CEO. Targethub Consulting.
                <br />
                Performance Marketing Action Coach.
                <br />
                Over 400+ Coaches Served.
              </p>
            </div>
          </div>

          {/* Workshop Details */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-700 border-slate-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2 text-orange-400">Date - 3 Day Live Workshop!</h4>
                <p>(7th Mon | 8th Tue | 9th Wed) JULY 2025</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700 border-slate-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2 text-orange-400">Time</h4>
                <p>( 7 PM - 9PM ) IST</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700 border-slate-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2 text-orange-400">Mode</h4>
                <p>Zoom Live (English)</p>
              </CardContent>
            </Card>
          </div>

          {/* Countdown Timer */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-4 gap-4 text-center">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="relative">
                  <div className="w-20 h-20 mx-auto border-4 border-orange-400 rounded-full flex flex-col items-center justify-center bg-slate-700">
                    <div className="text-2xl font-bold text-white">{value.toString().padStart(2, "0")}</div>
                    <div className="text-xs capitalize text-orange-400">{unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link href="/get-internship/checkout">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-8 py-4 mb-4 rounded-xl"
              >
                Register Now for <span className="line-through">₹1999</span> Just ₹49/-
              </Button>
            </Link>
            <p className="text-sm text-orange-300">(100% MBG if you dont like what you learn!)</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video bg-slate-600 rounded-lg flex items-center justify-center border-2 border-orange-400">
                <Play className="w-12 h-12 text-orange-400" />
              </div>
              <div className="text-white">
                <Quote className="w-8 h-8 text-orange-400 mb-4" />
                <blockquote className="text-lg mb-4">{testimonials[0].quote}</blockquote>
                <div>
                  <div className="font-bold text-orange-400">{testimonials[0].name}</div>
                  <div className="text-gray-300">{testimonials[0].title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Covered Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              🔓 <span className="text-orange-400">What Is Covered In 3 Days?</span>
            </h2>
            <p className="text-xl text-gray-300">The 3 Secrets To Crore Champion Success</p>
          </div>

          <div className="max-w-6xl mx-auto mb-12">
            <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center mb-8 border-2 border-orange-400">
              <Play className="w-16 h-16 text-orange-400" />
            </div>
            <p className="text-center text-lg text-gray-300">
              What makes Crore Champion Coaches unique? They follow a clear, repeatable pattern.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {dayContent.map((day, index) => (
              <Card key={index} className="overflow-hidden bg-slate-700 border-slate-600">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2">
                    <div className="bg-orange-500 text-white p-8">
                      <Badge className="bg-white text-orange-500 mb-4">{day.day}</Badge>
                      <h3 className="text-2xl font-bold mb-4">{day.title}</h3>
                      <div className="aspect-video bg-white/10 rounded mb-4"></div>
                      <p className="italic">"{day.subtitle}"</p>
                    </div>
                    <div className="p-8 bg-slate-700 text-white">
                      <ul className="space-y-3">
                        {day.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/get-internship/checkout">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-8 py-4 mb-4 rounded-xl"
              >
                Register Now for <span className="line-through">₹1999</span> Just ₹49/-
              </Button>
            </Link>
            <p className="text-sm text-orange-300">(100% MBG if you dont like what you learn!)</p>
          </div>
        </div>
      </section>

      {/* More Testimonials */}
      <section className="py-16 bg-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {testimonials.slice(1).map((testimonial, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
                <div
                  className={`aspect-video bg-slate-600 rounded-lg flex items-center justify-center border-2 border-orange-400 ${index % 2 === 1 ? "md:order-2" : ""}`}
                >
                  <Play className="w-12 h-12 text-orange-400" />
                </div>
                <div className={`text-white ${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <Quote className="w-8 h-8 text-orange-400 mb-4" />
                  <blockquote className="text-lg mb-4">"{testimonial.quote}"</blockquote>
                  <div>
                    <div className="font-bold text-orange-400">{testimonial.name}</div>
                    <div className="text-gray-300">{testimonial.title}</div>
                    {testimonial.company && <div className="text-gray-300">{testimonial.company}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              💡 <span className="text-orange-400">Why Me?</span>
            </h2>

            <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center mb-8 border-2 border-orange-400">
              <Play className="w-16 h-16 text-orange-400" />
            </div>

            <div className="text-left max-w-2xl mx-auto mb-8 text-white">
              <p className="text-xl mb-6">
                I have worked with over 400+ digital coaches till Now. I have worked with all kind of coaches,
              </p>
              <ul className="space-y-3">
                {[
                  "Coaches who fail and give up.",
                  "Coaches who keep restarting and blame their micro-niche.",
                  'Coaches stuck in "maybe one day it will work"',
                  "Coaches who survive.",
                  "And finally, coaches who dominate and become trendsetters",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-orange-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <p className="text-xl mb-4 text-white">Because I've personally built:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                {[
                  "Lead Generation Funnels",
                  "Effective Copywriting",
                  "Task Automations",
                  "Affiliate Systems",
                  "Performance Marketing",
                  "High Impact Presentations",
                ].map((skill, index) => (
                  <div key={index} className="bg-slate-700 border border-orange-400 rounded-lg p-4">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm text-white">{skill}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 text-white">
              <p className="text-xl mb-4">For some of the top 1% Crore Champion Coaches,</p>
              <div className="text-lg space-y-2">
                <p>
                  <span className="text-orange-400">💬</span> I network with the best in the game.
                </p>
                <p>
                  <span className="text-orange-400">💬</span> I work ONLY with digital coaches.
                </p>
                <p>
                  <span className="text-orange-400">💬</span> I'm a 1CR+ Champion Coach myself.
                </p>
              </div>
            </div>

            <p className="text-xl mb-8 text-white">
              I've walked this path. I know this game. I can show you how it's done. All you need to do is show up for 3
              days and listen.
            </p>

            <Link href="/get-internship/checkout">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-8 py-4 mb-4 rounded-xl"
              >
                START YOUR JOURNEY TOWARDS GREATNESS
              </Button>
            </Link>
            <p className="text-sm text-orange-300">(100% MBG if you dont like what you learn!)</p>
          </div>
        </div>
      </section>

      {/* Mistakes Section */}
      <section className="py-16 bg-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Avoid the <span className="text-orange-400">Costly Mistakes</span> Most Coaches Make
            </h2>
            <p className="text-xl text-gray-300 mb-8">Here are the 6 biggest mistakes:</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mistakes.map((mistake, index) => (
              <Card key={index} className="text-center bg-slate-600 border-slate-500">
                <CardContent className="p-6">
                  <X className="w-8 h-8 text-red-400 mx-auto mb-4" />
                  <div className="text-2xl mb-2">{mistake.icon}</div>
                  <h3 className="font-bold text-white">{mistake.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-2xl mx-auto text-center mb-8">
            <p className="text-lg mb-4 text-white">As long as you keep repeating these, you'll…</p>
            <ul className="space-y-2 text-left">
              {["Age faster", "Lose hair", "Get stressed", "Keep wondering why things don't work"].map(
                (consequence, index) => (
                  <li key={index} className="flex items-center gap-3 text-white">
                    <X className="w-5 h-5 text-red-400" />
                    <span>{consequence}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">
              🚦 <span className="text-orange-400">PUT A FULL STOP TO THESE.</span>
            </h3>
            <p className="text-lg mb-4 text-white">
              To succeed, you don't need to hustle harder. You need the right mentor and a proven roadmap.
            </p>
            <p className="text-lg mb-8 text-white">I can show you that path. But you have to show up.</p>

            <Link href="/get-internship/checkout">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-8 py-4 mb-4 rounded-xl"
              >
                MOVE TOWARDS YOUR DREAM NOW
              </Button>
            </Link>
            <p className="text-sm text-orange-300">(100% MBG – No Questions Asked)</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Frequently Asked <span className="text-orange-400">Questions</span>
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-slate-700 border-slate-600 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-orange-400">
                  1. Who is this workshop for?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Coaches (beginners or experienced) who want to scale to ₹1 CR+ with systems, not hustle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-slate-700 border-slate-600 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-orange-400">
                  2. Is this beginner-friendly?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes! Whether you're just starting or already doing webinars, this will give you a solid game plan.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-slate-700 border-slate-600 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-orange-400">
                  3. Is this a live workshop or a course?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  This is a live workshop with access to recordings for a limited time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-slate-700 border-slate-600 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-orange-400">
                  4. What if I can't attend all 3 days live?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  No problem. You'll get limited-time access to the replay recordings. You can watch the recording
                  before we take it down.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-slate-700 border-slate-600 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-orange-400">
                  5. What if I don't like it?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  You'll get 100% Money Back Guarantee if you feel it wasn't worth it.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-gray-300">
            This site is not part of the Google website Or Google Inc or Facebook website or Facebook Inc. This site is
            not endorsed by Google Inc Or Facebook Inc in any way.
          </p>
          <p>
            Copyright © <strong className="text-orange-400">Targethub</strong> All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t-2 border-orange-400 text-white p-4 shadow-lg z-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-orange-400">3 Day Live Zoom (7 PM - 9PM) IST</div>
              <div className="text-sm text-gray-300">(7th Mon | 8th Tue | 9th Wed) JULY 2025</div>
            </div>
          </div>

          <div className="hidden md:flex gap-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="w-12 h-12 border-2 border-orange-400 rounded-full flex flex-col items-center justify-center">
                  <div className="font-bold text-sm">{value.toString().padStart(2, "0")}</div>
                  <div className="text-xs capitalize text-orange-400">{unit}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/get-internship/checkout">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white mb-2 rounded-xl">
                Register Now for <span className="line-through">₹1999</span> Just ₹49/-
              </Button>
            </Link>
            <div className="text-xs text-orange-300">(100% MBG if you dont like what you learn!)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
