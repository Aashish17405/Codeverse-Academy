"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Curriculum() {
  const [activeTab, setActiveTab] = useState("month1");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const curriculumData: Record<
    string,
    {
      title: string;
      weeks: Array<{
        title: string;
        topics: string[];
      }>;
    }
  > = {
    month1: {
      title: "Month 1: Foundations",
      weeks: [
        {
          title: "Week 1-2: Programming Fundamentals",
          topics: [
            "Core programming concepts and syntax",
            "Data structures and algorithms",
            "Problem-solving methodologies",
            "Version control with Git and GitHub",
          ],
        },
        {
          title: "Week 3-4: Web Development Basics",
          topics: [
            "HTML5, CSS3, and responsive design",
            "JavaScript fundamentals and ES6+",
            "DOM manipulation and events",
            "Building interactive web pages",
          ],
        },
      ],
    },
    month2: {
      title: "Month 2: Frontend Development",
      weeks: [
        {
          title: "Week 1-2: Modern JavaScript & React",
          topics: [
            "Advanced JavaScript concepts",
            "React fundamentals and hooks",
            "State management and context API",
            "Building component-based UIs",
          ],
        },
        {
          title: "Week 3-4: Advanced Frontend",
          topics: [
            "Next.js and server-side rendering",
            "TypeScript integration",
            "Animation and interactive UIs",
            "Frontend performance optimization",
          ],
        },
      ],
    },
    month3: {
      title: "Month 3: Backend Development",
      weeks: [
        {
          title: "Week 1-2: Server-side Programming",
          topics: [
            "Node.js and Express fundamentals",
            "RESTful API design and implementation",
            "Database design and MongoDB",
            "Authentication and authorization",
          ],
        },
        {
          title: "Week 3-4: Advanced Backend",
          topics: [
            "Microservices architecture",
            "GraphQL API development",
            "Real-time applications with WebSockets",
            "Serverless functions and deployment",
          ],
        },
      ],
    },
    month4: {
      title: "Month 4: Full Stack Integration",
      weeks: [
        {
          title: "Week 1-2: Full Stack Projects",
          topics: [
            "Building end-to-end applications",
            "State management across the stack",
            "Performance optimization techniques",
            "Testing and debugging strategies",
          ],
        },
        {
          title: "Week 3-4: DevOps & Deployment",
          topics: [
            "CI/CD pipelines and automation",
            "Docker and containerization",
            "Cloud deployment (AWS/Azure/GCP)",
            "Monitoring and logging",
          ],
        },
      ],
    },
    month5: {
      title: "Month 5: Specialization & Career Prep",
      weeks: [
        {
          title: "Week 1-2: Specialization Tracks",
          topics: [
            "AI/ML integration in applications",
            "Mobile development with React Native",
            "Blockchain and Web3 technologies",
            "Advanced data visualization",
          ],
        },
        {
          title: "Week 3-4: Career Preparation",
          topics: [
            "Portfolio development and refinement",
            "Technical interview preparation",
            "Resume building and LinkedIn optimization",
            "Final capstone project presentation",
          ],
        },
      ],
    },
  };

  return (
    <section id="curriculum" className="py-12 sm:py-16 md:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16 px-4 sm:px-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Comprehensive Curriculum
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Our 5-month program is structured to provide you with a progressive
            learning experience, from fundamentals to advanced concepts.
          </p>
        </motion.div>

        <div ref={ref}>
          <Tabs
            defaultValue="month1"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="relative overflow-x-auto pb-2 mb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-full bg-gradient-to-r from-gray-900 to-transparent pointer-events-none sm:hidden z-10"></div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none sm:hidden z-10"></div>
              <div className="text-xs text-gray-400 text-center mb-2 sm:hidden">
                Swipe to see all months →
              </div>
              <div className="w-full overflow-x-auto scrollbar-hide pb-1">
                <div className="min-w-max">
                  <TabsList className="inline-flex w-full sm:w-auto flex-nowrap sm:grid sm:grid-cols-5 mb-4 sm:mb-6 bg-gray-800/50 p-1 rounded-lg">
                    {Object.keys(curriculumData).map((month, index) => (
                      <TabsTrigger
                        key={month}
                        value={month}
                        className="flex-shrink-0 min-w-[75px] sm:min-w-0 text-sm sm:text-base py-2 px-1 sm:py-2 sm:px-4 mx-0.5 first:ml-0 last:mr-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                      >
                        Month {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
            </div>

            {Object.keys(curriculumData).map((month) => (
              <TabsContent key={month} value={month}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-white">
                    {curriculumData[month].title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {curriculumData[month].weeks.map((week, index) => (
                      <Card
                        key={index}
                        className="bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
                      >
                        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                          <CardTitle className="text-cyan-400 text-base sm:text-lg md:text-xl">
                            {week.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                          <ul className="space-y-2">
                            {week.topics.map((topic, i) => (
                              <li key={i} className="flex items-start">
                                <span className="mr-2 text-cyan-500 flex-shrink-0">
                                  •
                                </span>
                                <span className="text-gray-300 text-sm sm:text-base">
                                  {topic}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
