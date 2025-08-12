"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Users } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

type FormValues = z.infer<typeof formSchema>;
interface EnrollmentPopupProps {
  initialVisible?: boolean;
  onClose?: () => void;
}

export default function EnrollmentPopup2({
  initialVisible = false,
  onClose,
}: EnrollmentPopupProps = {}) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    setIsVisible(initialVisible);
  }, [initialVisible]);

  const closePopup = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setLoadingMessage("Downloading brochure...");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phoneNumber: data.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit enquiry");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      downloadBrochure();
    } catch (error) {
      console.error("Error downloading the brochure:", error);
      setLoadingMessage("Failed to download the brochure enquiry. Please try again.");
      setLoading(false);
      toast.error("Failed to download the brochure. Please try again.");
    }
  };

  const downloadBrochure = () => {
    try {
      setLoadingMessage("Downloading brochure...");
      const link = document.createElement("a");
      link.href = "/brochure.pdf";
      link.download = "Ignite your Tech Career in 3 Months.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      toast.success("Brochure downloaded successfully!");
    } catch (error) {
      console.error("Error downloading brochure:", error);
      toast.error("Failed to download brochure. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
      form.reset();
      closePopup();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closePopup();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
              <Card className="bg-gray-800 border-gray-700 overflow-hidden relative">
                <Button
                  onClick={closePopup}
                  className="absolute top-2 right-2 z-10 rounded-full p-1 h-auto bg-transparent hover:bg-gray-700"
                  size="sm"
                  variant="ghost"
                >
                  <X className="h-5 w-5 text-gray-400" />
                  <span className="sr-only">Close</span>
                </Button>

                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-xl flex justify-center items-center text-white">
                    Book a Free Class
                  </CardTitle>
                  {/* Promotional Highlights */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-1 mb-4 text-center"
                  >
                    <p className="text-sm text-cyan-300 font-semibold">
                      🚀 Join the Super 30 of Tech – Limited Seats Only!
                    </p>
                    <p className="text-sm text-blue-300">
                      🎓 5-Month Career Program in Fullstack, AI & Web3
                    </p>
                    <p className="text-sm text-emerald-300">
                      💼 Internship + Certification + Portfolio + Job Support
                    </p>
                    <p className="text-sm text-yellow-300">
                      🏆 Hackathons, Real-World Projects & Mock Interviews
                    </p>
                  </motion.div>
                </CardHeader>

                <CardContent>
                  <div className="mb-2 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 text-sm font-medium mb-2 border border-cyan-500/20">
                      <Users className="inline-block w-4 h-4 mr-1" />
                      Only 30 students per batch!
                    </div>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 py-2"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                {...field}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email address"
                                type="email"
                                {...field}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your phone number"
                                {...field}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="text-sm text-white text-center animate-pulse">
                            {loadingMessage}
                          </div>
                        ) : (
                          "Download Brochure"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
