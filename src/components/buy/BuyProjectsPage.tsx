import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

export const BuyProjectsPage = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    sortBy: "latest"
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

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
      let transformedProjects = data.map(project => ({
        ...project,
        seller: {
          display_name: project.profiles?.display_name || 'Demo Developer'
        }
      }));

      // Add sample projects if database is empty
      if (transformedProjects.length === 0) {
        transformedProjects = [
          {
            id: 'sample-1',
            title: 'E-commerce Dashboard',
            description: 'Complete e-commerce admin dashboard with inventory management, order tracking, and analytics.',
            price_inr: 45000,
            category: 'dashboard',
            tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
            features: ['Real-time analytics', 'Inventory management', 'Order tracking', 'User management', 'Payment integration'],
            status: 'approved',
            seller: { display_name: 'Demo Developer' },
            screenshot_url: '/placeholder.svg',
            images: ['dashboard-1.jpg', 'dashboard-2.jpg', 'dashboard-3.jpg'],
            rating: 4.8,
            downloads: 142,
            admin_notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            download_url: null,
            seller_id: '00000000-0000-0000-0000-000000000000',
            profiles: null
          },
          {
            id: 'sample-2',
            title: 'Portfolio Website Template',
            description: 'Modern responsive portfolio website template with dark/light mode, animations, and contact form.',
            price_inr: 15000,
            category: 'portfolio',
            tech_stack: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
            features: ['Responsive design', 'Dark mode', 'Smooth animations', 'Contact form', 'SEO optimized'],
            status: 'approved',
            seller: { display_name: 'Demo Developer' },
            screenshot_url: '/placeholder.svg',
            images: ['portfolio-1.jpg', 'portfolio-2.jpg'],
            rating: 4.9,
            downloads: 89,
            admin_notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            download_url: null,
            seller_id: '00000000-0000-0000-0000-000000000000',
            profiles: null
          }
        ] as any;
      }

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

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const categories = [
    "E-commerce", "Portfolio", "Dashboard", "Landing Page", "Blog",
    "SaaS App", "Mobile App", "Game", "Educational", "Social Media"
  ];

  return (
    <div className="container py-4 sm:py-6 md:py-8 pb-20 lg:pb-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-2">Browse Projects</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {projects.length} projects available
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 p-4 sm:p-6 bg-muted/50 rounded-lg">
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium">Category</label>
          <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
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

        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium">Price Range</label>
          <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
            <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
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

        <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 md:col-span-1">
          <label className="text-xs sm:text-sm font-medium">Sort by</label>
          <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
            <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onProjectClick={handleProjectClick}
            />
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};