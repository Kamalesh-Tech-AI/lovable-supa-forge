import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, Download, Star } from "lucide-react";
import { useState } from "react";

export const BuyProjectsPage = () => {
  const [requirements, setRequirements] = useState({
    category: "",
    techStack: [],
    features: [],
    budget: "",
    description: ""
  });

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

  const mockProjects = [
    {
      id: 1,
      title: "E-commerce Dashboard",
      description: "Complete admin dashboard with inventory management, order tracking, and analytics.",
      price: 15000,
      rating: 4.8,
      downloads: 234,
      category: "Dashboard",
      techStack: ["React", "Node.js", "MongoDB"],
      seller: "TechStudio",
      screenshot: "/placeholder.svg"
    },
    {
      id: 2,
      title: "SaaS Landing Page",
      description: "Modern landing page with pricing tables, testimonials, and conversion optimization.",
      price: 8000,
      rating: 4.9,
      downloads: 456,
      category: "Landing Page",
      techStack: ["Next.js", "Tailwind"],
      seller: "DesignPro",
      screenshot: "/placeholder.svg"
    }
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Project</h1>
        <p className="text-muted-foreground">
          Browse thousands of ready-to-use projects or tell us your requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Requirements Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Project Requirements</span>
              </CardTitle>
              <CardDescription>
                Tell us what you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={requirements.category} onValueChange={(value) => 
                  setRequirements(prev => ({ ...prev, category: value }))
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

              <div className="space-y-2">
                <Label>Tech Stack</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {techStacks.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={requirements.techStack.includes(tech)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRequirements(prev => ({
                              ...prev,
                              techStack: [...prev.techStack, tech]
                            }));
                          } else {
                            setRequirements(prev => ({
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
              </div>

              <div className="space-y-2">
                <Label>Budget (₹)</Label>
                <Select value={requirements.budget} onValueChange={(value) => 
                  setRequirements(prev => ({ ...prev, budget: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5000">₹0 - ₹5,000</SelectItem>
                    <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
                    <SelectItem value="15000-30000">₹15,000 - ₹30,000</SelectItem>
                    <SelectItem value="30000+">₹30,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                <Search className="h-4 w-4 mr-2" />
                Find Matches
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Project Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">Available Projects</h2>
              <Badge variant="secondary">{mockProjects.length} projects found</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search projects..." 
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-t-lg relative overflow-hidden">
                  <img 
                    src={project.screenshot} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg p-1">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-background/80 text-foreground">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{project.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ₹{project.price.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Download className="h-3 w-3" />
                        <span>{project.downloads} downloads</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};