import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  projectTitle: string;
  price: number;
}

export const TermsModal = ({ isOpen, onClose, onAccept, projectTitle, price }: TermsModalProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleAccept = () => {
    if (acceptedTerms) {
      onAccept();
    }
  };

  const handleClose = () => {
    setAcceptedTerms(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Purchase Terms & Conditions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold">Project: {projectTitle}</h3>
            <p className="text-2xl font-bold text-primary">Total: ₹{price?.toLocaleString()}</p>
          </div>

          <ScrollArea className="h-[300px] w-full rounded border p-4">
            <div className="space-y-4 text-sm">
              <h4 className="font-semibold">Terms and Conditions for Project Purchase</h4>
              
              <div>
                <h5 className="font-medium">1. Digital Product License</h5>
                <p>This purchase grants you a non-exclusive, non-transferable license to use the digital project files for your personal or commercial use.</p>
              </div>

              <div>
                <h5 className="font-medium">2. Download Limitations</h5>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Each purchase allows for ONE (1) download only</li>
                  <li>If you need to download again, you must make a new purchase</li>
                  <li>Downloads are available immediately after successful payment</li>
                  <li>Download links expire after 24 hours of purchase</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium">3. Usage Rights</h5>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You may modify the project for your own use</li>
                  <li>You may use the project for commercial purposes</li>
                  <li>You may NOT resell or redistribute the original project files</li>
                  <li>You may NOT claim the project as your own original work</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium">4. Payment and Refunds</h5>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All payments are processed securely</li>
                  <li>Refunds are available within 7 days if the project doesn't work as described</li>
                  <li>No refunds after successful download unless there are technical issues</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium">5. Support</h5>
                <p>Basic support is provided for 30 days after purchase for technical issues related to the project setup and functionality.</p>
              </div>

              <div>
                <h5 className="font-medium">6. Intellectual Property</h5>
                <p>The original creator retains all intellectual property rights. Your purchase grants usage rights only, not ownership of the intellectual property.</p>
              </div>

              <div>
                <h5 className="font-medium">7. Limitation of Liability</h5>
                <p>RYZE and the project creators are not liable for any damages resulting from the use of purchased projects. Use at your own risk.</p>
              </div>

              <div>
                <h5 className="font-medium">8. Modification of Terms</h5>
                <p>These terms may be updated at any time. Continued use of the platform constitutes acceptance of modified terms.</p>
              </div>
            </div>
          </ScrollArea>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="accept-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            />
            <label
              htmlFor="accept-terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the Terms and Conditions
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAccept} disabled={!acceptedTerms}>
            Complete Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};