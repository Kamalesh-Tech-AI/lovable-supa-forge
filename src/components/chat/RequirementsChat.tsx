import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Search, Star, Download, Heart } from "lucide-react";

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

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    const requirements = extractRequirements(input);
    const botResponse = getBotResponse(input, requirements);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

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
    if (e.key === 'Enter') {
      handleSendMessage();
    }
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
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your project requirements..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};