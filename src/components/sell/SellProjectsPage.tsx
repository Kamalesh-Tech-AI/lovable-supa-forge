import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, DollarSign, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SellProjectsPage = () => {
const { toast } = useToast();
const [user, setUser] = useState(null);
const [projectData, setProjectData] = useState({
title: "",
description: "",
category: "",
techStack: [],
features: [],
price: "",
demoCommand: "",
zipFile: null
});
const [isSubmitting, setIsSubmitting] = useState(false);

// Upload state
const [isDragging, setIsDragging] = useState(false);
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [uploadedZipName, setUploadedZipName] = useState("");
const [uploadedZipPath, setUploadedZipPath] = useState("");
const [uploadedZipUrl, setUploadedZipUrl] = useState("");

const fileInputRef = useRef(null);

useEffect(() => {
const getUser = async () => {
const { data: { user } } = await supabase.auth.getUser();
setUser(user);
};
getUser();
}, []);

const categories = [
"E-commerce", "Portfolio", "Dashboard", "Landing Page", "Blog",
"SaaS App", "Mobile App", "Game", "Educational", "Social Media"
];

const techStacks = [
"React", "Next.js", "Vue.js", "Angular", "Node.js", "Python",
"Django", "Flask", "Express", "PHP", "Laravel", "WordPress"
];

const features = [
"Authentication", "Payment Gateway", "Database", "API Integration",
"Real-time Chat", "File Upload", "Email Integration", "Analytics",
"Search Functionality", "Admin Panel", "Mobile Responsive", "PWA"
];

const submissionSteps = [
{ id: 1, title: "Project Details", icon: FileText, completed: false },
{ id: 2, title: "Upload Files", icon: Upload, completed: !!uploadedZipPath },
{ id: 3, title: "Pricing", icon: DollarSign, completed: false },
{ id: 4, title: "Review", icon: CheckCircle, completed: false }
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const validateFile = (file) => {
if (!file) return "No file selected.";
const isZip = file.name.toLowerCase().endsWith(".zip") || file.type === "application/zip";
if (!isZip) return "Only .zip files are allowed.";
if (file.size > MAX_FILE_SIZE) return "File exceeds 100MB limit.";
return null;
};

const getUniquePath = (fileName) => {
const uid = user?.id || "anonymous";
const ts = Date.now();
const cleanName = fileName.replace(/\s+/g, "-").toLowerCase();
  return `${uid}/${ts}-${cleanName}`;
};

const getPublicUrlFromPath = (path) => {
const { data } = supabase.storage.from("projects").getPublicUrl(path);
return data?.publicUrl || "";
};

const uploadZipToStorage = async (file) => {
setUploading(true);
setUploadProgress(0);
try {
const path = getUniquePath(file.name);

  // Supabase JS SDK doesn't provide native progress for single-shot uploads.
  // We simulate progress for UX; actual upload is atomic.
  const progressTimer = setInterval(() => {
    setUploadProgress((p) => (p < 90 ? p + 5 : p));
  }, 200);

  const { error } = await supabase.storage.from("projects").upload(path, file, {
    upsert: false,
    contentType: "application/zip",
    cacheControl: "3600"
  });

  clearInterval(progressTimer);
  if (error) throw error;

  const publicUrl = getPublicUrlFromPath(path);

  setUploadProgress(100);
  setUploadedZipName(file.name);
  setUploadedZipPath(path);
  setUploadedZipUrl(publicUrl);

  toast({
    title: "Upload complete",
    description: "Your ZIP file has been uploaded successfully."
  });
} catch (err) {
  setUploadedZipName("");
  setUploadedZipPath("");
  setUploadedZipUrl("");
  toast({
    title: "Upload failed",
    description: err?.message || "Could not upload the ZIP file.",
    variant: "destructive"
  });
} finally {
  setUploading(false);
  setTimeout(() => setUploadProgress(0), 800);
}
};

const handleChooseFileClick = () => {
fileInputRef.current?.click();
};

const onFileSelected = async (e) => {
const file = e.target.files?.[0];
if (!file) return;
const err = validateFile(file);
if (err) {
toast({ title: "Invalid file", description: err, variant: "destructive" });
return;
}
await uploadZipToStorage(file);
};

const handleDrop = useCallback(
async (e) => {
e.preventDefault();
e.stopPropagation();
setIsDragging(false);
const file = e.dataTransfer.files?.[0];
if (!file) return;
const err = validateFile(file);
if (err) {
toast({ title: "Invalid file", description: err, variant: "destructive" });
return;
}
await uploadZipToStorage(file);
},
[toast]
);

const handleDragOver = (e) => {
e.preventDefault();
e.stopPropagation();
setIsDragging(true);
};

const handleDragLeave = (e) => {
e.preventDefault();
e.stopPropagation();
setIsDragging(false);
};

const handleSubmit = async (isDraft = false) => {
if (!user) {
toast({
title: "Authentication required",
description: "Please sign in to submit a project.",
variant: "destructive"
});
return;
}

if (!isDraft && (!projectData.title || !projectData.description || !projectData.price)) {
  toast({
    title: "Missing required fields",
    description: "Please fill in all required fields.",
    variant: "destructive"
  });
  return;
}

// Optional: enforce ZIP required for both draft and final; adjust as desired
// For now, require ZIP only for final submission
if (!isDraft && !uploadedZipPath) {
  toast({
    title: "ZIP file required",
    description: "Please upload your project ZIP before submitting for review.",
    variant: "destructive"
  });
  return;
}

setIsSubmitting(true);
try {
  const { error } = await supabase
    .from("projects")
    .insert({
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      tech_stack: projectData.techStack,
      features: projectData.features,
      price_inr: parseInt(projectData.price) || 0,
      status: isDraft ? "draft" : "pending",
      seller_id: user.id,
      demo_command: projectData.demoCommand || null,
      zip_path: uploadedZipPath || null,
      zip_url: uploadedZipUrl || null
    });

  if (error) throw error;

  toast({
    title: isDraft ? "Draft saved successfully!" : "Project submitted!",
    description: isDraft
      ? "Your project has been saved as a draft."
      : "Your project has been submitted for review."
  });

  // Reset form and upload state
  setProjectData({
    title: "",
    description: "",
    category: "",
    techStack: [],
    features: [],
    price: "",
    demoCommand: "",
    zipFile: null
  });
  setUploadedZipName("");
  setUploadedZipPath("");
  setUploadedZipUrl("");
} catch (error) {
  toast({
    title: "Error",
    description: "Failed to submit project. Please try again.",
    variant: "destructive"
  });
} finally {
  setIsSubmitting(false);
}
};

return (
<div className="container py-8">
<div className="mb-8">
<h1 className="text-3xl font-bold mb-2">Sell Your Project</h1>
<p className="text-muted-foreground">
Share your work with thousands of developers and earn money
</p>
</div>

  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    {/* Submission Steps */}
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Submission Process</CardTitle>
          <CardDescription>Follow these steps to list your project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissionSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center space-x-3">
                  <div
                    className={`rounded-full p-2 ${
                      step.completed
                        ? "bg-success text-success-foreground"
                        : index === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        step.completed
                          ? "text-success"
                          : index === 0
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
            <span>Complete source code in ZIP format</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
            <span>Clear documentation and setup instructions</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
            <span>Working demo command for screenshots</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
            <span>Original work or proper licensing</span>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Main Form */}
    <div className="lg:col-span-3">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Provide detailed information about your project</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Modern E-commerce Dashboard"
                value={projectData.title}
                onChange={(e) =>
                  setProjectData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={projectData.category}
                onValueChange={(value) =>
                  setProjectData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your project features, use cases, and what makes it special..."
              className="min-h-32"
              value={projectData.description}
              onChange={(e) =>
                setProjectData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Tech Stack *</Label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-4">
              {techStacks.map((tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <Checkbox
                    id={tech}
                    checked={(projectData.techStack || []).includes(tech)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setProjectData((prev) => ({
                          ...prev,
                          techStack: [...(prev.techStack || []), tech]
                        }));
                      } else {
                        setProjectData((prev) => ({
                          ...prev,
                          techStack: (prev.techStack || []).filter((t) => t !== tech)
                        }));
                      }
                    }}
                  />
                  <label htmlFor={tech} className="text-sm">
                    {tech}
                  </label>
                </div>
              ))}
            </div>

            {(projectData.techStack || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {(projectData.techStack || []).map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Key Features</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={(projectData.features || []).includes(feature)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setProjectData((prev) => ({
                          ...prev,
                          features: [...(prev.features || []), feature]
                        }));
                      } else {
                        setProjectData((prev) => ({
                          ...prev,
                          features: (prev.features || []).filter((f) => f !== feature)
                        }));
                      }
                    }}
                  />
                  <label htmlFor={feature} className="text-sm">
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 15000"
                value={projectData.price}
                onChange={(e) =>
                  setProjectData((prev) => ({ ...prev, price: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Platform fee: 15% -  You'll receive: ₹
                {projectData.price
                  ? Math.round(parseInt(projectData.price) * 0.85).toLocaleString()
                  : "0"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-command">Demo Command</Label>
              <Input
                id="demo-command"
                placeholder="e.g., npm run dev"
                value={projectData.demoCommand}
                onChange={(e) =>
                  setProjectData((prev) => ({ ...prev, demoCommand: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Command to run your project for screenshot generation
              </p>
            </div>
          </div>

          {/* Upload section */}
          <div className="space-y-2">
            <Label>Project Files *</Label>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? "border-primary/70 bg-primary/5" : "border-muted-foreground/25"
              } hover:border-primary/50`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Project ZIP</h3>
              <p className="text-muted-foreground mb-4">
                Drop your ZIP file here or click to browse
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,application/zip"
                className="hidden"
                onChange={onFileSelected}
              />

              <Button variant="outline" onClick={handleChooseFileClick} disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Choose File"}
              </Button>

              <p className="text-xs text-muted-foreground mt-2">Maximum file size: 100MB</p>

              {uploadedZipName && (
                <div className="mt-4 text-sm">
                  <span className="font-medium">Selected:</span> {uploadedZipName}
                </div>
              )}

              {uploading && (
                <div className="mt-4">
                  <div className="w-full bg-muted rounded h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {!uploading && uploadedZipPath && (
                <p className="text-xs text-green-600 mt-2">ZIP uploaded successfully.</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting || uploading}>
              Save as Draft
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-primary/80"
              onClick={() => handleSubmit(false)}
              disabled={
                isSubmitting ||
                uploading ||
                !projectData.title ||
                !projectData.description ||
                !projectData.price
              }
            >
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
);
};
