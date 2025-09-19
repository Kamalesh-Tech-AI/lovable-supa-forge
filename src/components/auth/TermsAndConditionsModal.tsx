import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  title?: string;
}

export const TermsAndConditionsModal = ({ 
  isOpen, 
  onClose, 
  onAccept, 
  title = "Terms and Conditions" 
}: TermsAndConditionsModalProps) => {
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full rounded border p-4">
          <div className="space-y-4 text-sm">
            <h4 className="font-semibold">RYZE Platform Terms and Conditions</h4>
            
            <div>
              <h5 className="font-medium">1. Acceptance of Terms</h5>
              <p>By accessing and using RYZE, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </div>

            <div>
              <h5 className="font-medium">2. Use License</h5>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Permission is granted to temporarily download one copy of RYZE's materials for personal, non-commercial transitory viewing only</li>
                <li>This is the grant of a license, not a transfer of title</li>
                <li>Under this license you may not modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium">3. User Accounts</h5>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to accept responsibility for all activities that occur under your account</li>
                <li>You must notify us immediately upon becoming aware of any breach of security</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium">4. Project Marketplace</h5>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All projects are provided by third-party sellers</li>
                <li>RYZE acts as a platform facilitator only</li>
                <li>Quality and functionality of projects are the responsibility of individual sellers</li>
                <li>Purchases are final once downloaded</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium">5. Payment Terms</h5>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All payments are processed through secure payment gateways</li>
                <li>Prices are subject to change without notice</li>
                <li>Refunds are handled according to our refund policy</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium">6. Privacy Policy</h5>
              <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service.</p>
            </div>

            <div>
              <h5 className="font-medium">7. Prohibited Uses</h5>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service for any unlawful purpose</li>
                <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>Submit false or misleading information</li>
                <li>Upload viruses or other malicious code</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium">8. Disclaimer</h5>
              <p>The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law, RYZE excludes all representations, warranties, conditions and terms.</p>
            </div>

            <div>
              <h5 className="font-medium">9. Limitations</h5>
              <p>In no event shall RYZE or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use RYZE.</p>
            </div>

            <div>
              <h5 className="font-medium">10. Governing Law</h5>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
            </div>

            <div>
              <h5 className="font-medium">11. Changes to Terms</h5>
              <p>RYZE reserves the right to revise these terms and conditions at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms and conditions.</p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2">
            <Checkbox
              id="accept-platform-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            />
          <label
            htmlFor="accept-platform-terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and agree to the Terms and Conditions
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAccept} disabled={!acceptedTerms}>
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};