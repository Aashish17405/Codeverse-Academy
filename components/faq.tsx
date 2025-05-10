"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const faqs = [
    {
      question: "What are the prerequisites for joining this program?",
      answer:
        "There are no strict prerequisites. The program is designed for beginners as well as those with some coding experience. Basic computer literacy and a passion for learning technology are all you need to get started.",
    },
    {
      question: "How is the batch size limited to 30 students?",
      answer:
        "We strictly limit each batch to 30 students to ensure personalized attention and high-quality education. This allows our instructors to provide individual feedback and support to each student throughout the program.",
    },
    {
      question: "What kind of projects will I work on during the program?",
      answer:
        "You'll work on 12+ real-world projects ranging from simple applications to complex full-stack systems. These include e-commerce platforms, social media apps, AI-powered tools, and more. All projects are designed to be portfolio-worthy and demonstrate your skills to potential employers.",
    },
    {
      question: "Is there a job guarantee after completing the program?",
      answer:
        "While we don't offer a formal job guarantee, our 100% job assistance program includes resume building, interview preparation, portfolio development, and direct connections with our hiring partners. Our placement rate is consistently over 90% within 3 months of graduation.",
    },
    {
      question: "Can I attend classes online instead of in-person?",
      answer:
        "Yes, we offer both in-person and online options. The curriculum and quality of education remain the same regardless of the format you choose. Online students receive the same access to instructors, resources, and job assistance as in-person students.",
    },
    {
      question: "What happens if I miss a class or fall behind?",
      answer:
        "All sessions are recorded and available for review. Additionally, we offer catch-up sessions and one-on-one mentoring to help you stay on track. Our instructors are committed to ensuring no student falls behind.",
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="faq" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about our program, curriculum, and career support.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={item}>
                <AccordionItem value={`item-${index}`} className="border-gray-700 py-2">
                  <AccordionTrigger className="text-left text-white hover:text-cyan-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
