import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Webhook, MessageSquare, Database } from "lucide-react";

interface N8nSetupGuideProps {
  onClose: () => void;
}

export const N8nSetupGuide = ({ onClose }: N8nSetupGuideProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                n8n Integration Setup Guide
              </CardTitle>
              <CardDescription>
                Connect your chatbot to n8n workflows for advanced AI responses
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Step 1: Receive Webhook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Create a webhook to receive user messages from the chatbot
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">Webhook Trigger</Badge>
                  <div className="text-xs font-mono bg-muted p-2 rounded">
                    POST /webhook/receive<br/>
                    Body: &#123;<br/>
                    &nbsp;&nbsp;"message": "string",<br/>
                    &nbsp;&nbsp;"session_id": "string",<br/>
                    &nbsp;&nbsp;"timestamp": "ISO date"<br/>
                    &#125;
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Step 2: Process with AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Connect to your AI service (OpenAI, Claude, etc.) to generate responses
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">AI Node</Badge>
                  <div className="text-xs space-y-1">
                    <div>• OpenAI Chat Model</div>
                    <div>• Anthropic Claude</div>
                    <div>• Google Gemini</div>
                    <div>• Custom AI API</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Webhook className="h-4 w-4" />
                  Step 3: Response Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Return the AI response in the expected format
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">JSON Response</Badge>
                  <div className="text-xs font-mono bg-muted p-2 rounded">
                    &#123;<br/>
                    &nbsp;&nbsp;"response": "AI generated text",<br/>
                    &nbsp;&nbsp;"session_id": "same session",<br/>
                    &nbsp;&nbsp;"timestamp": "ISO date"<br/>
                    &#125;
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sample n8n Workflow</h3>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Webhook Trigger (receives message)</span>
                  </div>
                  <div className="ml-5 border-l-2 border-muted-foreground/20 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">OpenAI Chat Model (process with AI)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">HTTP Response (return AI response)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuration Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Webhook URL</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Copy your n8n webhook URL and paste it in the chatbot settings
                  </p>
                  <div className="text-xs font-mono bg-muted p-2 rounded">
                    https://your-n8n.com/webhook/chat-ai
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enable authentication in n8n if needed
                  </p>
                  <div className="text-xs space-y-1">
                    <div>• Basic Auth</div>
                    <div>• API Key</div>
                    <div>• Custom Headers</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-center pt-4">
            <Button asChild>
              <a 
                href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View n8n Webhook Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};