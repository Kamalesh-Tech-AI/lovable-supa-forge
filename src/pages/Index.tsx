import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download, ShoppingCart, Code, Palette, Globe, Users, TrendingUp, Award, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredProjects = [
    {
      id: 1,
      title: "Modern E-commerce Dashboard",
      description: "Complete admin dashboard for e-commerce with analytics, inventory management, and order tracking.",
      price: 15000,
      category: "Dashboard",
      rating: 4.9,
      downloads: 234,
      image: "/placeholder.svg",
      techStack: ["React", "TypeScript", "Tailwind"]
    },
    {
      id: 2,
      title: "SaaS Landing Page Template",
      description: "Beautiful, responsive landing page template perfect for SaaS products with pricing tables.",
      price: 8000,
      category: "Landing Page",
      rating: 4.8,
      downloads: 187,
      image: "/placeholder.svg",
      techStack: ["Next.js", "React", "CSS"]
    },
    {
      id: 3,
      title: "Portfolio Website Builder",
      description: "Dynamic portfolio builder with custom themes, contact forms, and project galleries.",
      price: 12000,
      category: "Portfolio",
      rating: 4.7,
      downloads: 156,
      image: "/placeholder.svg",
      techStack: ["Vue.js", "Node.js", "MongoDB"]
    }
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "100+" },
    { icon: Code, label: "Projects Sold", value: "50+" },
    { icon: TrendingUp, label: "Revenue Generated", value: "₹15k+" },
    { icon: Award, label: "Top Developers", value: "20+" }
  ];

  const categories = [
    { name: "E-commerce", count: 45, icon: ShoppingCart },
    { name: "Dashboards", count: 32, icon: TrendingUp },
    { name: "Portfolios", count: 28, icon: Users },
    { name: "Landing Pages", count: 56, icon: Globe },
    { name: "Blogs", count: 23, icon: Code },
    { name: "SaaS Apps", count: 19, icon: Palette }
  ];

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-muted/30 py-10 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-tight">
            Buy & Sell Premium Projects
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xs xs:max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-4">
            Discover ready-to-use projects, get custom development work, or sell your own creations to thousands of developers.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button size="lg" asChild className="w-full xs:w-auto text-sm sm:text-base">
              <Link to="/buy">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Projects
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full xs:w-auto text-sm sm:text-base">
              <Link to="/sell">
                <Code className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Sell Your Project
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-3 sm:p-4">
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-4 text-primary" />
                  <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm md:text-base text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Featured Projects</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-md md:max-w-2xl mx-auto px-4">
              Discover our hand-picked selection of premium projects created by top developers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{project.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{project.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold">₹{project.price.toLocaleString()}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Download className="h-4 w-4 mr-1" />
                      {project.downloads}
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to="/buy">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/buy">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 sm:py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Browse by Category</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              Find the perfect project type for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="text-center p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-primary" />
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{category.count} projects</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4">Ready to Get Started?</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
              Join thousands of developers who are already buying and selling projects on our platform.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" asChild className="w-full xs:w-auto text-sm sm:text-base">
                <Link to="/custom">
                  <Code className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Get Custom Work
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full xs:w-auto text-sm sm:text-base">
                <Link to="/sell">
                  <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Start Selling
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
