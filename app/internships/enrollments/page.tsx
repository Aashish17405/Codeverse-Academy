"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  collegeName: z.string().min(2, { message: "College name is required" }),
  interestedInternship: z.enum(["AI", "WEB_DEV"], {
    required_error: "Select an internship",
  }),
  collegeEmail: z.string().min(2, { message: "College email is required" }),
  phoneNumber: z.string().min(10, { message: "Enter a valid phone number" }),
  whatsappNumber: z
    .string()
    .min(10, { message: "Enter a valid WhatsApp number" }),
  homeLocation: z.string().min(2, { message: "Home location is required" }),
  currentLocation: z
    .string()
    .min(2, { message: "Current location is required" }),
  attendOffline: z
    .boolean(),
  certificationMode: z.enum(["online", "offline"], {
    required_error: "Select a certification mode",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function InternshipEnrollment() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      collegeName: "",
      interestedInternship: undefined,
      collegeEmail: "",
      phoneNumber: "",
      whatsappNumber: "",
      homeLocation: "",
      currentLocation: "",
      attendOffline: false,
      certificationMode: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/internship-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }
      toast({
        title: "Enrollment Submitted!",
        description: "Your internship enrollment has been received.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <Card className="w-full max-w-xl bg-gray-800/50 border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            Internship Enrollment
          </CardTitle>
          <CardDescription className="text-gray-300">
            Fill out the form below to apply for an internship
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
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
                name="collegeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      College Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your college name or NA"
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
                name="interestedInternship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Interested Internship
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select internship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AI">AI</SelectItem>
                        <SelectItem value="WEB_DEV">WEB DEV</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      College Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your college email or N/A"
                        {...field}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormDescription>
                      If you don't have a college email, then type N/A.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Phone Number<span className="text-red-500">*</span>
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
              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      WhatsApp Number<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your WhatsApp number"
                        {...field}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormDescription>
                      This will be used for future conversations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Home Location<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your home location"
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
                name="currentLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Current Location<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your current location"
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
                name="attendOffline"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="attendOffline"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="attendOffline"
                        className="text-white cursor-pointer"
                      >
                        Will be able to attend offline?
                      </FormLabel>
                    </div>
                    <FormDescription className="text-yellow-400">
                      You must tick yes if you want to visit offline, else you
                      won't be allowed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certificationMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Certification Mode<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="online" id="cert-online" />
                          <FormLabel
                            htmlFor="cert-online"
                            className="text-white cursor-pointer"
                          >
                            Online
                          </FormLabel>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="offline" id="cert-offline" />
                          <FormLabel
                            htmlFor="cert-offline"
                            className="text-white cursor-pointer"
                          >
                            Offline
                          </FormLabel>
                        </div>
                      </RadioGroup>
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
                {loading ? "Submitting..." : "Submit Enrollment"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
