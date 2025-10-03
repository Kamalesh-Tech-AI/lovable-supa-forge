import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Download, Heart, Eye, User } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    price_inr: number;
    category: string;
    tech_stack: string[];
    features: string[];
    seller: {
      display_name: string;
      avatar_url?: string;
    };
    rating?: number;
    downloads?: number;
    images?: string[];
    screenshot_url?: string;
  };
  onProjectClick: (project: any) => void;
}

export const ProjectCard = ({ project, onProjectClick }: ProjectCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return; // User not authenticated
      }

      if (isLiked) {
        // Unlike the project
        await supabase
          .from('project_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', project.id);
      } else {
        // Like the project
        await supabase
          .from('project_likes')
          .insert({
            user_id: user.id,
            project_id: project.id
          });
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={handleLikeToggle}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-3 mt-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.seller.avatar_url} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{project.seller.display_name}</p>
            {project.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{project.rating}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Badge variant="secondary">{project.category}</Badge>
            {project.downloads && (
              <div className="flex items-center space-x-1">
                <Download className="h-3 w-3" />
                <span>{project.downloads}</span>
              </div>
            )}
          </div>

          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tech_stack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.tech_stack.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tech_stack.length - 3}
                </Badge>
              )}
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Key features: {project.features.slice(0, 2).join(", ")}
              {project.features.length > 2 && "..."}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto">
          <div>
            <p className="text-2xl font-bold text-primary">
              ₹{project.price_inr?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">One-time purchase</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => onProjectClick(project)}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};