"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Brain, Briefcase, Award, Users, Rocket } from "lucide-react"

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <Code className="h-10 w-10 text-cyan-400" />,
      title: "Comprehensive Curriculum",
      description:
        "Master the latest technologies with our carefully crafted curriculum covering frontend, backend, and emerging tech.",
    },
    {
      icon: <Brain className="h-10 w-10 text-blue-400" />,
      title: "Hands-on Learning",
      description:
        "Build real-world projects that solve actual problems, enhancing your portfolio and practical skills.",
    },
    {
      icon: <Award className="h-10 w-10 text-cyan-400" />,
      title: "Industry Certification",
      description:
        "Earn recognized certifications that validate your expertise and boost your credibility with employers.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-400" />,
      title: "Small Batch Size",
      description:
        "With only 30 students per batch, receive personalized attention and guidance from our expert instructors.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-cyan-400" />,
      title: "Career Acceleration",
      description: "Fast-track your career with our 5-month intensive program designed to get you job-ready quickly.",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-blue-400" />,
      title: "Job Placement Support",
      description:
        "Benefit from our extensive industry network and dedicated placement assistance after course completion.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Program Highlights
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our program is designed to equip you with cutting-edge skills and knowledge that employers are actively
            seeking.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
