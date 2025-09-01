import React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ShoppingBag, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const UserTypeModal = ({ isOpen, onClose, userId }: UserTypeModalProps) => {
  const [selectedType, setSelectedType] = useState<'buyer' | 'seller' | 'both' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userTypes = [
    {
      id: 'buyer' as const,
      title: 'Buyer',
      description: 'Looking to purchase ready-made projects and custom solutions',
      icon: ShoppingCart,
      features: ['Browse marketplace', 'Purchase projects', 'Request custom work']
    },
    {
      id: 'seller' as const,
      title: 'Seller',
      description: 'Ready to sell your projects and offer custom development services',
      icon: ShoppingBag,
      features: ['List projects for sale', 'Offer custom services', 'Earn from your work']
    },
    {
      id: 'both' as const,
      title: 'Both Buyer & Seller',
      description: 'Want to both buy and sell projects on the marketplace',
      icon: Users,
      features: ['Full marketplace access', 'Buy and sell projects', 'Maximum flexibility']
    }
  ];

  const handleSaveUserType = async () => {
    if (!selectedType) {
      toast.error('Please select a user type');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: selectedType })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`Welcome! You're now registered as a ${selectedType === 'both' ? 'buyer and seller' : selectedType}`);
      onClose();
    } catch (error) {
      console.error('Error updating user type:', error);
      toast.error('Failed to save user type. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Welcome to ProjectHub!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Let's get you set up. How would you like to use our marketplace?
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {userTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-primary border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          isSelected ? 'bg-primary' : 'bg-muted-foreground'
                        }`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <Button
            onClick={handleSaveUserType}
            disabled={!selectedType || isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading ? 'Setting up...' : 'Continue'}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't worry, you can change this later in your settings.
        </p>
      </DialogContent>
    </Dialog>
  );
};