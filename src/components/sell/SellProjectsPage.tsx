import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, DollarSign, Tags, Image, CheckCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UpgradeModal } from "./UpgradeModal";

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
    fileUrl: "",
    fileName: "",
    zipFile: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  const handleInputChange = (field: string, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check user's subscription status
        const { data: subData } = await supabase
          .from('seller_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (!subData) {
          // Create default free subscription
          await supabase
            .from('seller_subscriptions')
            .insert({
              user_id: user.id,
              plan_type: 'free',
              max_projects: 3
            });
          setSubscription({ plan_type: 'free', max_projects: 3 });
        } else {
          setSubscription(subData);
        }
        
        // Get current project count
        const { count } = await supabase
          .from('sell_projects')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', user.id);
        
        setProjectCount(count || 0);
      }
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
    { id: 2, title: "Upload Files", icon: Upload, completed: false },
    { id: 3, title: "Pricing", icon: DollarSign, completed: false },
    { id: 4, title: "Review", icon: CheckCircle, completed: false }
  ];

  const uploadFileToStorage = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files.",
        variant: "destructive"
      });
      return null;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    // Check project limit
    const maxProjects = subscription?.max_projects || 3;
    if (projectCount >= maxProjects) {
      setShowUpgradeModal(true);
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a project.",
        variant: "destructive"
      });
      return;
    }

    if (!isDraft && (!projectData.title || !projectData.description || !projectData.price || !projectData.zipFile)) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields and upload a project file.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let fileUrl = null;
      
      // Upload file if provided
      if (projectData.zipFile) {
        fileUrl = await uploadFileToStorage(projectData.zipFile);
        if (!fileUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      const { error } = await supabase
        .from('sell_projects')
        .insert({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          tech_stack: projectData.techStack,
          features: projectData.features,
          price_inr: parseInt(projectData.price) || 0,
          status: isDraft ? 'draft' : 'pending',
          seller_id: user.id,
          file_url: fileUrl,
          demo_command: projectData.demoCommand
        });

      if (error) throw error;

      toast({
        title: isDraft ? "Draft saved successfully!" : "Project submitted!",
        description: isDraft ? "Your project has been saved as a draft." : "Your project has been submitted for review.",
      });

      // Reset form
      setProjectData({
        title: "",
        description: "",
        category: "",
        techStack: [],
        features: [],
        price: "",
        demoCommand: "",
        fileUrl: "",
        fileName: "",
        zipFile: null
      });

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
                      <div className={`rounded-full p-2 ${
                        step.completed 
                          ? "bg-success text-success-foreground" 
                          : index === 0 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          step.completed ? "text-success" : index === 0 ? "text-primary" : "text-muted-foreground"
                        }`}>
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
              <CardDescription>
                Provide detailed information about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input 
                    id="title"
                    placeholder="e.g., Modern E-commerce Dashboard"
                    value={projectData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={projectData.category} onValueChange={(value) => 
                    handleInputChange('category', value)
                  }>
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tech Stack *</Label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-4">
                  {techStacks.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={projectData.techStack.includes(tech)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setProjectData(prev => ({
                              ...prev,
                              techStack: [...prev.techStack, tech]
                            }));
                          } else {
                            setProjectData(prev => ({
                              ...prev,
                              techStack: prev.techStack.filter(t => t !== tech)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={tech} className="text-sm">{tech}</label>
                    </div>
                  ))}
                </div>
                {projectData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {projectData.techStack.map((tech) => (
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
                        checked={projectData.features.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setProjectData(prev => ({
                              ...prev,
                              features: [...prev.features, feature]
                            }));
                          } else {
                            setProjectData(prev => ({
                              ...prev,
                              features: prev.features.filter(f => f !== feature)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={feature} className="text-sm">{feature}</label>
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
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Platform fee: 15% • You'll receive: ₹{projectData.price ? Math.round(parseInt(projectData.price) * 0.85).toLocaleString() : '0'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demo-command">Demo Command</Label>
                  <Input 
                    id="demo-command"
                    placeholder="e.g., npm run dev"
                    value={projectData.demoCommand}
                    onChange={(e) => handleInputChange('demoCommand', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Command to run your project for screenshot generation
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Files *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Project ZIP</h3>
                  <p className="text-muted-foreground mb-4">
                    Drop your ZIP file here or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProjectData(prev => ({ ...prev, zipFile: file }));
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Choose File"}
                  </Button>
                  {projectData.zipFile && (
                    <p className="text-sm text-success mt-2">
                      Selected: {projectData.zipFile.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum file size: 100MB
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                >
                  Save as Draft
                </Button>
                <Button 
                  className="bg-gradient-to-r from-primary to-primary/80"
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || !projectData.title || !projectData.description || !projectData.price || !projectData.zipFile}
                >
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentProjects={projectCount}
        maxProjects={subscription?.max_projects || 3}
      />
    </div>
  );
};