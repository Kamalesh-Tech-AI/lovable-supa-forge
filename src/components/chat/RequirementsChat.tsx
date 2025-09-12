import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings, Send, Bot, User, Search, Star, Download, Heart, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { N8nSetupGuide } from "./N8nSetupGuide";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ProjectMatch {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  downloads: number;
  category: string;
  techStack: string[];
  seller: string;
  screenshot: string;
}

interface RequirementsChatProps {
  onComplete?: (requirements: any) => void;
}

export const RequirementsChat = ({ onComplete }: RequirementsChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m here to help you find the perfect project. What kind of project are you looking for?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [extractedRequirements, setExtractedRequirements] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [webhookUrls, setWebhookUrls] = useState({
    send: '',
    receive: ''
  });
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mockProjects: ProjectMatch[] = [
    {
      id: 1,
      title: "E-commerce Dashboard",
      description: "Complete admin dashboard with inventory management, order tracking, and analytics.",
      price: 15000,
      rating: 4.8,
      downloads: 234,
      category: "Dashboard",
      techStack: ["React", "Node.js", "MongoDB"],
      seller: "TechStudio",
      screenshot: "/placeholder.svg"
    },
    {
      id: 2,
      title: "SaaS Landing Page",
      description: "Modern landing page with pricing tables, testimonials, and conversion optimization.",
      price: 8000,
      rating: 4.9,
      downloads: 456,
      category: "Landing Page",
      techStack: ["Next.js", "Tailwind"],
      seller: "DesignPro",
      screenshot: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "Responsive portfolio with contact form, project showcase, and blog integration.",
      price: 5000,
      rating: 4.7,
      downloads: 189,
      category: "Portfolio",
      techStack: ["React", "Tailwind"],
      seller: "WebCrafters",
      screenshot: "/placeholder.svg"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load webhook URLs from localStorage
    const savedUrls = localStorage.getItem('n8n_webhook_urls');
    if (savedUrls) {
      setWebhookUrls(JSON.parse(savedUrls));
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = (message: any) => {
    try {
      const history = JSON.parse(localStorage.getItem('chat_history') || '[]');
      history.push({
        session_id: sessionId,
        message: message,
        timestamp: new Date().toISOString()
      });
      // Keep only last 100 messages
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
      localStorage.setItem('chat_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Send message to n8n webhook
  const sendToN8nWebhook = async (userMessage: string) => {
    if (!webhookUrls.send) {
      console.warn('No n8n send webhook URL configured');
      return null;
    }

    try {
      const response = await fetch(webhookUrls.send, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.message || null;
    } catch (error) {
      console.error('Error sending to n8n webhook:', error);
      toast({
        title: "Webhook Error",
        description: "Failed to send message to n8n webhook. Using fallback response.",
        variant: "destructive"
      });
      return null;
    }
  };

  const extractRequirements = (userMessage: string) => {
    // Simple keyword extraction - in production, this would use NLP
    const lowerMessage = userMessage.toLowerCase();
    
    const categories = ['e-commerce', 'portfolio', 'dashboard', 'landing page', 'blog', 'saas'];
    const techStacks = ['react', 'next.js', 'vue', 'angular', 'node.js', 'python', 'tailwind'];
    const features = ['authentication', 'payment', 'database', 'api', 'chat', 'admin panel'];

    const foundCategory = categories.find(cat => lowerMessage.includes(cat));
    const foundTech = techStacks.filter(tech => lowerMessage.includes(tech.toLowerCase()));
    const foundFeatures = features.filter(feature => lowerMessage.includes(feature));

    // Extract budget
    const budgetMatch = lowerMessage.match(/(\d+k?|\d+,\d+)/);
    const budget = budgetMatch ? budgetMatch[0] : null;

    return {
      category: foundCategory,
      techStack: foundTech,
      features: foundFeatures,
      budget: budget,
      originalMessage: userMessage
    };
  };

  const getBotResponse = (userMessage: string, requirements: any) => {
    if (requirements.category || requirements.techStack.length > 0) {
      let response = "Great! I found some key requirements:\n\n";
      
      if (requirements.category) {
        response += `• Category: ${requirements.category}\n`;
      }
      if (requirements.techStack.length > 0) {
        response += `• Tech Stack: ${requirements.techStack.join(', ')}\n`;
      }
      if (requirements.features.length > 0) {
        response += `• Features: ${requirements.features.join(', ')}\n`;
      }
      if (requirements.budget) {
        response += `• Budget: ₹${requirements.budget}\n`;
      }
      
      response += "\nLet me search for matching projects...";
      return response;
    }

    return "I'd love to help you find the right project! Could you tell me more about what you're looking for? For example, what type of project (e-commerce, portfolio, dashboard), what technologies you prefer (React, Next.js, etc.), and your budget range?";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to history
    saveChatHistory({
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    });

    // Send to n8n webhook
    const webhookResponse = await sendToN8nWebhook(input);
    
    let botResponse: string;
    let requirements: any;

    if (webhookResponse) {
      // Use n8n response
      botResponse = webhookResponse;
      requirements = extractRequirements(input);
    } else {
      // Fallback to local processing
      requirements = extractRequirements(input);
      botResponse = getBotResponse(input, requirements);
    }

    setTimeout(async () => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Save bot message to history
      saveChatHistory({
        type: 'bot',
        content: botResponse,
        timestamp: new Date().toISOString()
      });

      if (requirements.category || requirements.techStack.length > 0) {
        setExtractedRequirements(requirements);
        // Call onComplete immediately to show filtered results
        if (onComplete) {
          onComplete(requirements);
        }
        setTimeout(() => {
          setShowResults(true);
        }, 1500);
      }
    }, 1000);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveWebhookUrls = () => {
    localStorage.setItem('n8n_webhook_urls', JSON.stringify(webhookUrls));
    setShowSettings(false);
    toast({
      title: "Settings Saved",
      description: "n8n webhook URLs have been saved successfully."
    });
  };

  if (showResults && extractedRequirements) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => {
              setShowResults(false);
              // Call onComplete to trigger the main search
              if (onComplete) {
                onComplete(extractedRequirements);
              }
            }}
            className="mb-4"
          >
            ← Show All Projects
          </Button>
          <h1 className="text-3xl font-bold mb-2">Sample Matching Projects</h1>
          <p className="text-muted-foreground">
            Found {mockProjects.length} sample projects matching your requirements
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Click "Show All Projects" above to see real projects from our database
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {extractedRequirements.category && (
              <Badge variant="secondary">Category: {extractedRequirements.category}</Badge>
            )}
            {extractedRequirements.techStack.map((tech: string) => (
              <Badge key={tech} variant="outline">{tech}</Badge>
            ))}
            {extractedRequirements.budget && (
              <Badge variant="secondary">Budget: ₹{extractedRequirements.budget}</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-t-lg relative overflow-hidden">
                <img 
                  src={project.screenshot} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg p-1">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-background/80 text-foreground">
                    {project.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{project.rating}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      ₹{project.price.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Download className="h-3 w-3" />
                      <span>{project.downloads} downloads</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Project</h1>
        <p className="text-muted-foreground">
          Tell me what you're looking for and I'll help you find the best match
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">AI Project Assistant</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGuide(true)}
                title="Setup Guide"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                title="Webhook Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`p-2 rounded-full ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your project requirements..."
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">n8n Webhook Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="send-webhook">Send Webhook URL</Label>
                  <Input
                    id="send-webhook"
                    placeholder="https://your-n8n-instance.com/webhook/send"
                    value={webhookUrls.send}
                    onChange={(e) => setWebhookUrls(prev => ({ ...prev, send: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL to send user messages to n8n
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receive-webhook">Receive Webhook URL</Label>
                  <Input
                    id="receive-webhook"
                    placeholder="https://your-n8n-instance.com/webhook/receive"
                    value={webhookUrls.receive}
                    onChange={(e) => setWebhookUrls(prev => ({ ...prev, receive: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL to receive responses from n8n (optional)
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Button onClick={saveWebhookUrls} className="flex-1">
                    Save Settings
                  </Button>
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Setup Guide Modal */}
      {showGuide && (
        <N8nSetupGuide onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
};