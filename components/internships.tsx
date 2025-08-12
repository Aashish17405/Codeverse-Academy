import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Internships() {
  return (
    <div className="w-full flex flex-col items-center my-4 sm:my-6 md:my-8 px-4 sm:px-6 lg:px-8">
      {/* Main Container with enhanced animations */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.2
        }}
        className="relative w-full max-w-6xl mx-auto"
      >
        {/* Animated background gradient */}
        <motion.div
          animate={{
            background: [
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-20 blur-xl"
        />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`
              }}
            />
          ))}
        </div>

        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 border border-gray-600/30 backdrop-blur-sm overflow-hidden"
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 193, 7, 0.3)",
                "0 0 40px rgba(255, 193, 7, 0.5)",
                "0 0 20px rgba(255, 193, 7, 0.3)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Left content section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex-1 text-center lg:text-left space-y-3 sm:space-y-4"
          >
            {/* Rocket emoji with animation */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block text-3xl sm:text-4xl md:text-5xl mb-2"
            >
              🚀
            </motion.div>

            {/* Main heading with gradient text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent leading-tight"
            >
              Unlock Your Tech Career with a Free Internship!
            </motion.h2>

            {/* Description with stagger animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="space-y-2"
            >
              <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                Gain real-world experience, work on live projects, and earn a
                government-registered certificate.
              </p>
              <motion.p
                animate={{ 
                  color: ["#fbbf24", "#f59e0b", "#d97706", "#fbbf24"] 
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="font-semibold text-sm sm:text-base md:text-lg"
              >
                ⚡ Limited seats—apply now!
              </motion.p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start pt-2"
            >
              {["Live Projects", "Certificate", "Real World Experience"].map((feature, index) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-xs sm:text-sm text-blue-300 border border-blue-400/30 backdrop-blur-sm"
                >
                  ✨ {feature}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right button section */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <Link href="/internships" passHref legacyBehavior>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 opacity-50 blur-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 hover:from-yellow-300 hover:via-orange-300 hover:to-yellow-300 text-black font-bold px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg shadow-2xl transition-all duration-300 rounded-xl border-2 border-yellow-300/50 backdrop-blur-sm min-w-[140px] sm:min-w-[160px] md:min-w-[180px]"
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(0,0,0,0.5)",
                        "0 2px 4px rgba(0,0,0,0.5)",
                        "0 0 0px rgba(0,0,0,0.5)"
                      ]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Explore Internships
                  </motion.span>
                  
                  {/* Arrow animation */}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="ml-2 inline-block"
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}