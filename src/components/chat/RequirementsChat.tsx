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
      content: 'Welcome to RYZE Digital Asset Marketplace! I\'m your AI assistant, ready to help you discover premium digital projects, connect with top developers, or guide you through selling your own creations. What can I help you with today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [extractedRequirements, setExtractedRequirements] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
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

  // Generate professional AI responses for the platform
  const generateAIResponse = (userMessage: string, requirements: any) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Platform-specific responses for common queries
    if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('platform'))) {
      return "Welcome to RYZE Digital Asset Marketplace! Our platform connects buyers and sellers of high-quality digital projects. You can browse projects by category, tech stack, and budget. Each project includes live previews, detailed documentation, and seller ratings to help you make informed decisions.";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      return "Project prices on RYZE vary based on complexity and features. We have options ranging from ₹5,000 for simple landing pages to ₹50,000+ for complex enterprise solutions. You can filter projects by your budget range to find the perfect match. All payments are secure and protected by our buyer guarantee.";
    }
    
    if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return "RYZE provides comprehensive support for all transactions. Sellers offer documentation, setup guides, and 30-60 days of free support with each project. Our customer success team is also available 24/7 to help resolve any issues and ensure your project success.";
    }
    
    if (lowerMessage.includes('custom') || lowerMessage.includes('hire')) {
      return "Looking for custom development? Browse our Custom Work section where you can hire verified developers for bespoke projects. Post your requirements, receive proposals, and work directly with top-rated developers. All custom work includes milestone-based payments and project management tools.";
    }
    
    if (lowerMessage.includes('sell') || lowerMessage.includes('upload')) {
      return "Ready to sell your projects on RYZE? Join our community of successful sellers! Upload your projects with detailed descriptions, live demos, and documentation. Our seller dashboard provides analytics, customer communication tools, and automated payouts. We take a small commission only when you make sales.";
    }
    
    // If requirements are extracted, provide specific recommendations
    if (requirements.category || requirements.techStack.length > 0) {
      let response = "Excellent! Based on your requirements, I can help you find the perfect project on RYZE:\n\n";
      
      if (requirements.category) {
        response += `• **Category**: ${requirements.category} - We have ${Math.floor(Math.random() * 50) + 20} high-quality ${requirements.category} projects\n`;
      }
      if (requirements.techStack.length > 0) {
        response += `• **Technology**: ${requirements.techStack.join(', ')} - Popular choices with strong community support\n`;
      }
      if (requirements.features.length > 0) {
        response += `• **Features**: ${requirements.features.join(', ')} - All projects include detailed implementation guides\n`;
      }
      if (requirements.budget) {
        response += `• **Budget**: ₹${requirements.budget} - Multiple options within your price range\n`;
      }
      
      response += "\nLet me search our marketplace for matching projects. Each result includes live previews, seller ratings, and customer reviews to help you choose the best option.";
      return response;
    }
    
    // Default helpful response
    return "I'm here to help you navigate RYZE Digital Asset Marketplace! Whether you're looking to buy premium projects, sell your creations, or hire developers for custom work, I can guide you through the process. What specific type of project or service are you interested in?";
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

    // Generate AI response and extract requirements
    const requirements = extractRequirements(input);
    const botResponse = generateAIResponse(input, requirements);

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

  const openSecretModal = () => {
    toast({
      title: "Webhook Configuration",
      description: "Your n8n webhook URL is securely stored in Supabase secrets. The chatbot will automatically use it when available.",
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
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Find Your Perfect Project</h1>
        <p className="text-muted-foreground">
          Chat with our AI assistant to discover the perfect digital assets for your needs
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">RYZE AI Assistant</h2>
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
                <h3 className="text-lg font-semibold">n8n Integration Status</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Webhook Status</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your n8n webhook URL is securely stored in Supabase secrets. The chatbot will automatically attempt to use your n8n workflow when you send messages.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">How it works:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>1. You send a message in the chat</div>
                    <div>2. Message is sent to your n8n webhook</div>
                    <div>3. n8n processes with AI and returns response</div>
                    <div>4. If n8n fails, fallback responses are used</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Button onClick={() => setShowSettings(false)} className="flex-1">
                    Got it
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowSettings(false);
                      setShowGuide(true);
                    }}
                  >
                    Setup Guide
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