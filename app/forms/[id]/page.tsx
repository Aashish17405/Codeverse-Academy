"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface FormField {
  id: string;
  label: string;
  type:
    | "TEXT"
    | "EMAIL"
    | "NUMBER"
    | "TEXTAREA"
    | "CHECKBOX"
    | "RADIO"
    | "SELECT";
  required: boolean;
  options: string[];
}

interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormResponse {
  fieldId: string;
  value: string;
}

export default function FormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Resolve params and set formId
    const resolveParams = async () => {
      const resolvedParams = await params;
      setFormId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    // Fetch form when formId is available
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    if (!formId) return;

    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data);
        // Initialize responses with empty values
        const initialResponses = data.fields.map((field: FormField) => ({
          fieldId: field.id,
          value: "",
        }));
        setResponses(initialResponses);
      } else {
        toast({
          title: "Error",
          description: "Form not found or inactive",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching form:", error);
      toast({
        title: "Error",
        description: "Failed to load form",
        variant: "destructive",
      });
    }
  };

  const updateResponse = (fieldId: string, value: string) => {
    setResponses((prev) =>
      prev.map((response) =>
        response.fieldId === fieldId ? { ...response, value } : response
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formId) return;

    // Validate required fields
    const requiredFields = form?.fields.filter((field) => field.required) || [];
    const missingFields = requiredFields.filter((field) => {
      const response = responses.find((r) => r.fieldId === field.id);
      return !response || !response.value.trim();
    });

    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Success",
          description: "Form submitted successfully!",
        });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const response = responses.find((r) => r.fieldId === field.id);
    const value = response?.value || "";

    switch (field.type) {
      case "TEXT":
      case "EMAIL":
      case "NUMBER":
        return (
          <Input
            type={
              field.type === "EMAIL"
                ? "email"
                : field.type === "NUMBER"
                ? "number"
                : "text"
            }
            value={value}
            onChange={(e) => updateResponse(field.id, e.target.value)}
            required={field.required}
          />
        );

      case "TEXTAREA":
        return (
          <Textarea
            value={value}
            onChange={(e) => updateResponse(field.id, e.target.value)}
            required={field.required}
            rows={4}
          />
        );

      case "CHECKBOX":
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={value.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value
                      ? value.split(",").filter((v) => v.trim())
                      : [];
                    if (checked) {
                      updateResponse(
                        field.id,
                        [...currentValues, option].join(",")
                      );
                    } else {
                      updateResponse(
                        field.id,
                        currentValues.filter((v) => v !== option).join(",")
                      );
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "RADIO":
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => updateResponse(field.id, val)}
            required={field.required}
          >
            {field.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "SELECT":
        return (
          <Select
            value={value}
            onValueChange={(val) => updateResponse(field.id, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md shadow-lg border border-border">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2 text-primary">
                Thank You!
              </h1>
              <p className="text-muted-foreground">
                Your response has been submitted successfully.
              </p>
              <Button className="mt-4" onClick={() => router.push("/")}>
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-2 sm:px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-lg border border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-primary break-words">
              {form.title}
            </CardTitle>
            {form.description && (
              <p className="text-muted-foreground mt-1">{form.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label
                    className="text-base text-foreground"
                    htmlFor={field.id}
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  <div className="w-full">{renderField(field)}</div>
                </div>
              ))}

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Form"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
