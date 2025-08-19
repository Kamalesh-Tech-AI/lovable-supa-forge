import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, MessageSquare, Clock, CheckCircle, User, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CustomWorkPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState({
    title: "",
    description: "",
    budget: "",
    timeline: "",
    category: "",
    techStack: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const mockRequests = [
    {
      id: 1,
      title: "Custom E-learning Platform",
      description: "Need a comprehensive e-learning platform with video streaming, quizzes, and progress tracking.",
      budget: 50000,
      status: "in_progress",
      assignedTo: {
        name: "Sarah Dev",
        avatar: "/placeholder.svg",
        rating: 4.9
      },
      progress: 65,
      lastUpdate: "2 hours ago",
      milestones: [
        { title: "Backend API", status: "completed", amount: 15000 },
        { title: "Frontend UI", status: "in_progress", amount: 20000 },
        { title: "Video Integration", status: "pending", amount: 15000 }
      ]
    }
  ];

  const handleSubmitRequest = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a custom request.",
        variant: "destructive"
      });
      return;
    }

    if (!requestData.title || !requestData.description || !requestData.budget) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically create a custom_requests table
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Request submitted!",
        description: "Your custom project request has been submitted. We'll match you with suitable developers soon.",
      });

      // Reset form
      setRequestData({
        title: "",
        description: "",
        budget: "",
        timeline: "",
        category: "",
        techStack: ""
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CreateRequestForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Project Request</CardTitle>
        <CardDescription>
          Describe your project requirements and we'll match you with the perfect developer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title *</Label>
            <Input 
              id="project-title"
              placeholder="e.g., Custom Inventory Management System"
              value={requestData.title}
              onChange={(e) => setRequestData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (₹) *</Label>
            <Select value={requestData.budget} onValueChange={(value) => setRequestData(prev => ({ ...prev, budget: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                <SelectItem value="100000+">₹1,00,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Detailed Description *</Label>
          <Textarea 
            id="description"
            placeholder="Describe your project requirements, features, and any specific technologies you prefer..."
            className="min-h-32"
            value={requestData.description}
            onChange={(e) => setRequestData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timeline">Expected Timeline</Label>
            <Select value={requestData.timeline} onValueChange={(value) => setRequestData(prev => ({ ...prev, timeline: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                <SelectItem value="3-4weeks">3-4 weeks</SelectItem>
                <SelectItem value="1-2months">1-2 months</SelectItem>
                <SelectItem value="3+months">3+ months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={requestData.category} onValueChange={(value) => setRequestData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-app">Web Application</SelectItem>
                <SelectItem value="mobile-app">Mobile Application</SelectItem>
                <SelectItem value="desktop-app">Desktop Application</SelectItem>
                <SelectItem value="api">API Development</SelectItem>
                <SelectItem value="integration">System Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preferred Technologies (Optional)</Label>
          <Input 
            placeholder="e.g., React, Node.js, PostgreSQL" 
            value={requestData.techStack}
            onChange={(e) => setRequestData(prev => ({ ...prev, techStack: e.target.value }))}
          />
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" disabled={isSubmitting}>Save as Draft</Button>
          <Button 
            className="bg-gradient-to-r from-primary to-primary/80"
            onClick={handleSubmitRequest}
            disabled={isSubmitting || !requestData.title || !requestData.description || !requestData.budget}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Post Request"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const MyRequestsList = () => (
    <div className="space-y-6">
      {mockRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl mb-2">{request.title}</CardTitle>
                <CardDescription className="text-base">
                  {request.description}
                </CardDescription>
              </div>
              <Badge className={
                request.status === "in_progress" 
                  ? "bg-primary text-primary-foreground" 
                  : request.status === "completed" 
                    ? "bg-success text-success-foreground"
                    : "bg-muted"
              }>
                {request.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Budget: ₹{request.budget.toLocaleString()}</span>
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Updated {request.lastUpdate}</span>
              </span>
            </div>

            {request.assignedTo && (
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <Avatar>
                  <AvatarImage src={request.assignedTo.avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{request.assignedTo.name}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{request.assignedTo.rating}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Project Progress</h4>
                <span className="text-sm text-muted-foreground">{request.progress}% complete</span>
              </div>
              <Progress value={request.progress} className="h-2" />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Milestones</h4>
              {request.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-full p-1 ${
                      milestone.status === "completed" 
                        ? "bg-success text-success-foreground" 
                        : milestone.status === "in_progress"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span className="font-medium">{milestone.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">₹{milestone.amount.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground capitalize">
                      {milestone.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                View Messages
              </Button>
              <Button>View Details</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Custom Development</h1>
        <p className="text-muted-foreground">
          Get custom projects built exactly to your specifications
        </p>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant={activeTab === "create" ? "default" : "outline"}
          onClick={() => setActiveTab("create")}
        >
          Create Request
        </Button>
        <Button 
          variant={activeTab === "requests" ? "default" : "outline"}
          onClick={() => setActiveTab("requests")}
        >
          My Requests
          <Badge variant="secondary" className="ml-2">
            {mockRequests.length}
          </Badge>
        </Button>
      </div>

      {activeTab === "create" ? <CreateRequestForm /> : <MyRequestsList />}
    </div>
  );
};