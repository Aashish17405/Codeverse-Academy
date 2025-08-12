"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    {
      name: "Jay Prakash",
      role: "Software Engineer at DEEL",
      content:
        "This program completely transformed my career. The hands-on projects and mentorship gave me the confidence to excel in interviews. I secured a job at Google within weeks of completing the course!",
      stars: 5,
    },
    {
      name: "Rohit Kumar",
      role: "Software Developer at XLRI Jamshedpur",
      content:
        "Before this program, there were no institutions in Jamshedpur offering this level of education. The curriculum is incredibly well-structured and up-to-date with industry standards. The small batch size ensured I got personalized attention. This program was worth every penny!",
      stars: 5,
    },
    {
      name: "Karan Singh",
      role: "Full Stack Developer at XNeuron",
      content:
        "The instructors are supportive, and the career guidance was invaluable. This program has truly elevated the educational landscape, especially in places like Jamshedpur, where such opportunities were rare. The best investment I've made in myself.",
      stars: 5,
    },
  ];


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
    <section id="testimonials" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from our alumni who have successfully transformed their careers through our program.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full flex flex-col bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                <CardContent className="pt-6 flex-grow">
                  <div className="flex mb-4">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-3">"{testimonial.content}"</p>
                </CardContent>
                <CardFooter className="border-t border-gray-700 pt-6">
                  <div className="flex-initial items-center space-x-4">
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}