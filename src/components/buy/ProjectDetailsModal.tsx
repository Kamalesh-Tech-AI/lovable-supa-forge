import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Download, Heart, ShoppingCart, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TermsModal } from "./TermsModal";

interface ProjectDetailsModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [canDownload, setCanDownload] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      checkPurchaseStatus();
    }
  }, [isOpen, project]);

  const checkPurchaseStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: purchases } = await supabase
        .from('purchases')
        .select('*')
        .eq('buyer_id', user.id)
        .eq('project_id', project.id);

      if (purchases && purchases.length > 0) {
        setHasPurchased(true);
        // Check if user can still download (only once per purchase)
        const lastPurchase = purchases[purchases.length - 1];
        setCanDownload(lastPurchase.status === 'completed');
      }
    } catch (error) {
      console.error('Error checking purchase status:', error);
    }
  };

  const handlePurchase = () => {
    setShowTermsModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to purchase");
        return;
      }

      // Create purchase record
      const { error } = await supabase
        .from('purchases')
        .insert({
          buyer_id: user.id,
          project_id: project.id,
          amount_paid: project.price_inr,
          currency: 'INR',
          status: 'completed',
          payment_method: 'demo',
          transaction_id: `demo_${Date.now()}`
        });

      if (error) throw error;

      toast.success("Purchase successful! You can now download the project.");
      setHasPurchased(true);
      setCanDownload(true);
      setShowTermsModal(false);
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast.error("Failed to process purchase");
    }
  };

  const handleDownload = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !canDownload) return;

      // Mark download as used
      await supabase
        .from('purchases')
        .update({ status: 'downloaded' })
        .eq('buyer_id', user.id)
        .eq('project_id', project.id)
        .eq('status', 'completed');

      setCanDownload(false);
      toast.success("Download started! Purchase again to download more times.");
      
      // In a real app, this would trigger the actual download
      // For demo purposes, we'll just show a message
      toast.info("Demo: Download would start here");
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error("Failed to download");
    }
  };

  const getProjectImages = () => {
    if (!project.images || project.images.length === 0) {
      return [project.screenshot_url || '/placeholder.svg'];
    }

    return project.images.map(imagePath => {
      const { data } = supabase.storage.from('project-files').getPublicUrl(imagePath);
      return data.publicUrl;
    });
  };

  const handleLikeToggle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to like projects");
        return;
      }

      if (isLiked) {
        await supabase
          .from('project_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', project.id);
        
        setIsLiked(false);
        toast.success("Removed from favorites");
      } else {
        await supabase
          .from('project_likes')
          .insert({
            user_id: user.id,
            project_id: project.id
          });
        
        setIsLiked(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Failed to update favorites");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Carousel */}
            <div className="space-y-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {getProjectImages().map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {getProjectImages().length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={project.seller?.display_name} />
                      <AvatarFallback>
                        {project.seller?.display_name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{project.seller?.display_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{project.rating || 4.8}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{project.downloads || 0} downloads</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Badge className="mr-2">{project.category}</Badge>
                  <div className="text-3xl font-bold text-primary">
                    ₹{project.price_inr?.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="font-semibold mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="space-y-1">
                  {project.features?.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleLikeToggle}
                  className="flex items-center space-x-2"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </Button>

                {hasPurchased ? (
                  canDownload ? (
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Now
                    </Button>
                  ) : (
                    <Button onClick={handlePurchase} className="flex-1">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase Again
                    </Button>
                  )
                ) : (
                  <Button onClick={handlePurchase} className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                )}
              </div>

              {hasPurchased && !canDownload && (
                <p className="text-sm text-muted-foreground">
                  You've already downloaded this project. Purchase again to download more times.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleConfirmPurchase}
        projectTitle={project.title}
        price={project.price_inr}
      />
    </>
  );
};