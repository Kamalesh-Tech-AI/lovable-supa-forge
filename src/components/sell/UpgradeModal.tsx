import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjects: number;
  maxProjects: number;
}

export const UpgradeModal = ({ isOpen, onClose, currentProjects, maxProjects }: UpgradeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            You've reached your project limit ({currentProjects}/{maxProjects}). Upgrade to unlock unlimited projects!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <Badge variant="secondary" className="mb-2">Free Plan</Badge>
              <p className="text-2xl font-bold mb-2">₹0</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Up to 3 projects
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Basic support
                </li>
              </ul>
            </div>

            <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
              <Badge className="mb-2">Pro Plan</Badge>
              <p className="text-2xl font-bold mb-2">₹999<span className="text-sm text-muted-foreground">/mo</span></p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Unlimited projects
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Featured listings
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Advanced analytics
                </li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button className="bg-gradient-to-r from-primary to-primary-variant">
            <Zap className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
