import { RequirementsChat } from "@/components/chat/RequirementsChat";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const BuyProjectsPage = () => {
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priceRange: "all",
    sortBy: "latest"
  });

  useEffect(() => {
    if (!showChat) {
      fetchProjects();
    }
  }, [showChat, filters]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles:seller_id(display_name)
        `)
        .eq('status', 'approved');

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.priceRange && filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price_inr', min).lte('price_inr', max);
        } else {
          query = query.gte('price_inr', min);
        }
      }

      // Sort by
      switch (filters.sortBy) {
        case 'price_low':
          query = query.order('price_inr', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price_inr', { ascending: false });
          break;
        case 'latest':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to include seller info
      const transformedProjects = data.map(project => ({
        ...project,
        seller: {
          display_name: project.profiles?.display_name || 'Unknown Seller'
        }
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (projectId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase projects.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically integrate with a payment system
    toast({
      title: "Coming Soon",
      description: "Payment integration will be available soon!",
    });
  };

  const handleRequirementsComplete = (requirements: any) => {
    setShowChat(false);
    // Use requirements to filter projects
    if (requirements.category) {
      setFilters(prev => ({ ...prev, category: requirements.category.toLowerCase() }));
    }
    if (requirements.budget) {
      setFilters(prev => ({ ...prev, priceRange: requirements.budget }));
    }
  };

  const categories = [
    "E-commerce", "Portfolio", "Dashboard", "Landing Page", "Blog",
    "SaaS App", "Mobile App", "Game", "Educational", "Social Media"
  ];

  if (showChat) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Project</h1>
          <p className="text-muted-foreground">
            Tell us what you're looking for and we'll show you the best matches
          </p>
        </div>
        
        <RequirementsChat onComplete={handleRequirementsComplete} />
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setShowChat(false)}
          >
            Or browse all projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Projects</h1>
            <p className="text-muted-foreground">
              {projects.length} projects available
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowChat(true)}
          >
            Back to Requirements Chat
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="All prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All prices</SelectItem>
              <SelectItem value="0-10000">₹0 - ₹10,000</SelectItem>
              <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
              <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
              <SelectItem value="50000">₹50,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sort by</label>
          <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};