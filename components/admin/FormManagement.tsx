"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface FormField {
  id?: string;
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
  isActive: boolean;
  createdAt: string;
  fields: FormField[];
  _count: {
    responses: number;
  };
}

interface FormResponse {
  id: string;
  createdAt: string;
  fieldResponses: {
    id: string;
    value: string;
    formField: {
      label: string;
      type: string;
    };
  }[];
}

export default function FormManagement() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResponsesDialogOpen, setIsResponsesDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [sendEmailOnSubmit, setSendEmailOnSubmit] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (sendEmailOnSubmit) {
      // Check if an email field already exists
      const emailFieldIndex = fields.findIndex((f) => f.type === "EMAIL");
      if (emailFieldIndex === -1) {
        // Add email field at the top
        setFields([
          {
            label: "Email",
            type: "EMAIL",
            required: true,
            options: [],
          },
          ...fields,
        ]);
      }
    } else {
      if (
        fields.length > 0 &&
        fields[0].type === "EMAIL" &&
        fields[0].label === "Email"
      ) {
        setFields(fields.slice(1));
      }
    }
  }, [sendEmailOnSubmit]);

  const fetchForms = async () => {
    setIsLoadingForms(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/forms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch forms",
        variant: "destructive",
      });
    } finally {
      setIsLoadingForms(false);
    }
  };

  const fetchResponses = async (formId: string) => {
    setIsLoadingResponses(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/forms/${formId}/responses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setResponses(data);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch responses",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        label: "",
        type: "TEXT",
        required: false,
        options: [],
      },
    ]);
  };

  const updateField = (index: number, field: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...field };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addOption = (fieldIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.push("");
    setFields(newFields);
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
    setFields(newFields);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(newFields);
  };

  const createForm = async () => {
    if (!formTitle.trim()) {
      toast({
        title: "Error",
        description: "Form title is required",
        variant: "destructive",
      });
      return;
    }

    if (fields.length === 0) {
      toast({
        title: "Error",
        description: "At least one field is required",
        variant: "destructive",
      });
      return;
    }

    if (sendEmailOnSubmit && (!emailSubject.trim() || !emailContent.trim())) {
      toast({
        title: "Error",
        description: "Email subject and content are required if sending email.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          fields: fields.filter((field) => field.label.trim()),
          sendEmailOnSubmit,
          emailSubject: sendEmailOnSubmit ? emailSubject : undefined,
          emailContent: sendEmailOnSubmit ? emailContent : undefined,
        }),
      });

      if (response.ok) {
        const newForm = await response.json();
        setForms([newForm, ...forms]);
        setIsCreateDialogOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Form created successfully",
        });
      } else {
        throw new Error("Failed to create form");
      }
    } catch (error) {
      console.error("Error creating form:", error);
      toast({
        title: "Error",
        description: "Failed to create form",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFields([]);
    setSendEmailOnSubmit(false);
    setEmailSubject("");
    setEmailContent("");
  };

  const copyFormLink = (formId: string) => {
    const link = `${window.location.origin}/forms/${formId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Form link copied to clipboard",
    });
  };

  const viewResponses = async (form: Form) => {
    setSelectedForm(form);
    await fetchResponses(form.id);
    setIsResponsesDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Form Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Form Title *</Label>
                <Input
                  id="title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter form title"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter form description"
                  className="mt-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Form Fields</Label>
                  <Button type="button" variant="outline" onClick={addField}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Field Label *</Label>
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              // Prevent editing label for auto-added email field
                              sendEmailOnSubmit &&
                              index === 0 &&
                              field.type === "EMAIL"
                                ? undefined
                                : updateField(index, { label: e.target.value })
                            }
                            placeholder="Enter field label"
                            className="mt-2"
                            disabled={
                              sendEmailOnSubmit &&
                              index === 0 &&
                              field.type === "EMAIL"
                            }
                          />
                        </div>
                        <div>
                          <Label>Field Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: any) =>
                              // Prevent changing type for auto-added email field
                              sendEmailOnSubmit &&
                              index === 0 &&
                              field.type === "EMAIL"
                                ? undefined
                                : updateField(index, { type: value })
                            }
                            disabled={
                              sendEmailOnSubmit &&
                              index === 0 &&
                              field.type === "EMAIL"
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TEXT">Text</SelectItem>
                              <SelectItem value="EMAIL">Email</SelectItem>
                              <SelectItem value="NUMBER">Number</SelectItem>
                              <SelectItem value="TEXTAREA">
                                Text Area
                              </SelectItem>
                              <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                              <SelectItem value="RADIO">Radio</SelectItem>
                              <SelectItem value="SELECT">Select</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`required-${index}`}
                            checked={field.required}
                            onCheckedChange={(checked) =>
                              // Prevent changing required for auto-added email field
                              sendEmailOnSubmit &&
                              index === 0 &&
                              field.type === "EMAIL"
                                ? undefined
                                : updateField(index, {
                                    required: checked as boolean,
                                  })
                            }
                            disabled={
                              sendEmailOnSubmit &&
                              index === 0 &&
                              field.type === "EMAIL"
                            }
                          />
                          <Label htmlFor={`required-${index}`}>Required</Label>
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              // Prevent removing auto-added email field
                              sendEmailOnSubmit &&
                              index === 0 &&
                              field.type === "EMAIL"
                                ? undefined
                                : removeField(index)
                            }
                            disabled={
                              sendEmailOnSubmit &&
                              index === 0 &&
                              field.type === "EMAIL"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {(field.type === "CHECKBOX" ||
                        field.type === "RADIO" ||
                        field.type === "SELECT") && (
                        <div className="mt-4 space-y-2">
                          <Label>Options</Label>
                          {field.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) =>
                                  updateOption(
                                    index,
                                    optionIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(index)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email-on-submit"
                  checked={sendEmailOnSubmit}
                  onCheckedChange={(checked) => setSendEmailOnSubmit(!!checked)}
                />
                <Label htmlFor="send-email-on-submit">
                  Send email to user on submission?
                </Label>
              </div>
              {sendEmailOnSubmit && (
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="email-subject">Email Subject</Label>
                    <Input
                      id="email-subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-content">Email Content</Label>
                    <Textarea
                      id="email-content"
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Enter email content to send to user"
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createForm}>Create Form</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Created Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingForms
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                : forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">
                        {form.title}
                      </TableCell>
                      <TableCell>{form.description || "-"}</TableCell>
                      <TableCell>{form.fields.length}</TableCell>
                      <TableCell>{form._count?.responses ?? 0}</TableCell>
                      <TableCell>{formatDate(form.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={form.isActive ? "default" : "secondary"}
                        >
                          {form.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyFormLink(form.id)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewResponses(form)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={isResponsesDialogOpen}
        onOpenChange={setIsResponsesDialogOpen}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Responses - {selectedForm?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Total Responses: {responses.length}
              </p>
            </div>

            {isLoadingResponses ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                ))}
              </div>
            ) : responses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No responses yet for this form.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      {selectedForm?.fields.map((field) => (
                        <TableHead key={field.id}>{field.label}</TableHead>
                      ))}
                      <TableHead>Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response, index) => (
                      <TableRow key={response.id}>
                        <TableCell>{responses.length - index}</TableCell>
                        {selectedForm?.fields.map((field) => {
                          const fieldResponse = response.fieldResponses.find(
                            (fr) => fr.formField.label === field.label
                          );
                          return (
                            <TableCell key={field.id}>
                              {fieldResponse ? fieldResponse.value : "-"}
                            </TableCell>
                          );
                        })}
                        <TableCell>{formatDate(response.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
