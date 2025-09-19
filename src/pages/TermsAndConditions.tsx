import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>RYZE Platform Terms of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full">
              <div className="space-y-6 text-sm pr-4">
                <section>
                  <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using RYZE ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">2. Description of Service</h2>
                  <p>
                    RYZE is a digital marketplace platform that connects buyers and sellers of web development projects, templates, 
                    and digital assets. We facilitate transactions between independent parties but do not create, own, or control the projects listed on our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">3. User Accounts</h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You must be at least 18 years old to create an account</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You agree to accept responsibility for all activities that occur under your account</li>
                    <li>You must provide accurate and complete information when creating your account</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">4. Marketplace Rules</h2>
                  <h3 className="font-medium mb-2">For Buyers:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                    <li>All purchases are final once the download begins</li>
                    <li>Each purchase allows for one (1) download only</li>
                    <li>You may use purchased projects for personal or commercial purposes</li>
                    <li>You may not resell or redistribute the original project files</li>
                    <li>Refunds are available within 7 days if the project doesn't work as described</li>
                  </ul>
                  
                  <h3 className="font-medium mb-2">For Sellers:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>You must own all rights to the projects you list</li>
                    <li>Projects must be functional and as described</li>
                    <li>You are responsible for providing basic support for 30 days after purchase</li>
                    <li>RYZE takes a 15% commission on all sales</li>
                    <li>You retain intellectual property rights to your work</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">5. Payment Terms</h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All payments are processed through secure, third-party payment processors</li>
                    <li>Prices are displayed in Indian Rupees (INR) unless otherwise specified</li>
                    <li>Payment must be completed before project access is granted</li>
                    <li>Sellers receive payment within 14 days of confirmed delivery</li>
                    <li>All fees and commissions are clearly disclosed before purchase</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">6. Intellectual Property</h2>
                  <p className="mb-2">
                    Sellers retain all intellectual property rights to their projects. Buyers receive a license to use 
                    the purchased project according to the terms specified at the time of purchase.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>The RYZE platform and its original content are protected by copyright and trademark laws</li>
                    <li>You may not copy, modify, or distribute our platform content without permission</li>
                    <li>User-generated content remains the property of the respective users</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">7. Privacy Policy</h2>
                  <p>
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. 
                    By using our service, you agree to our privacy practices as outlined in our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">8. Prohibited Uses</h2>
                  <p className="mb-2">You may not use our service:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To upload or transmit viruses or any other type of malicious code</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">9. Disclaimer</h2>
                  <p>
                    The information on this platform is provided on an "as is" basis. To the fullest extent permitted by law, 
                    RYZE excludes all representations, warranties, conditions and terms relating to our platform and the use of this platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">10. Limitation of Liability</h2>
                  <p>
                    In no event shall RYZE, its officers, directors, employees, or agents be liable to you for any direct, 
                    indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Errors, mistakes, or inaccuracies of content</li>
                    <li>Personal injury or property damage resulting from your use of our service</li>
                    <li>Any unauthorized access to or use of our secure servers</li>
                    <li>Any interruption or cessation of transmission to or from our platform</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">11. Indemnification</h2>
                  <p>
                    You agree to defend, indemnify, and hold harmless RYZE and its subsidiaries, agents, licensors, managers, 
                    and other affiliated companies, and their employees, contractors, agents, officers and directors, from and against any and all claims, 
                    damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">12. Termination</h2>
                  <p>
                    We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
                    under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">13. Governing Law</h2>
                  <p>
                    These Terms shall be interpreted and governed by the laws of India. Any dispute arising from these terms 
                    shall be subject to the exclusive jurisdiction of the courts of India.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">14. Changes to Terms</h2>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                    If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">15. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms and Conditions, please contact us at support@ryze.com
                  </p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};