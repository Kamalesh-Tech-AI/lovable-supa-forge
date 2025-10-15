import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const messageSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(5000, "Message must be less than 5000 characters")
});

export const RequestMessagesPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [request, setRequest] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        setUserRole(profile?.role || 'buyer');
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (requestId) {
      fetchRequest();
      fetchMessages();

      // Subscribe to real-time message updates
      const channel = supabase
        .channel('message-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'developer_messages',
            filter: `custom_request_id=eq.${requestId}`
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) throw error;
      setRequest(data);
    } catch (error) {
      console.error('Error fetching request:', error);
      toast({
        title: "Error",
        description: "Failed to load request details.",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('developer_messages')
        .select('*')
        .eq('custom_request_id', requestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    // Validate message input
    const validation = messageSchema.safeParse({ message: newMessage.trim() });
    if (!validation.success) {
      toast({
        title: "Invalid message",
        description: validation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      // Determine sender type based on role
      const senderType = userRole === 'admin' ? 'admin' : userRole === 'developer' ? 'developer' : 'buyer';
      
      const { error } = await supabase
        .from('developer_messages')
        .insert({
          custom_request_id: requestId,
          sender_id: user.id,
          sender_type: senderType,
          message: validation.data.message
        });

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container max-w-5xl py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/custom')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Requests
      </Button>

      {request && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{request.title}</CardTitle>
                <CardDescription className="mt-2">{request.description}</CardDescription>
              </div>
              <Badge className={
                request.status === "in_progress" 
                  ? "bg-primary text-primary-foreground" 
                  : request.status === "completed" 
                    ? "bg-success text-success-foreground"
                    : "bg-muted"
              }>
                {request.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card className="flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            Chat with the admin and developer about this project
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet.</p>
                <p className="text-sm mt-2">Start a conversation with your developer.</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                const senderLabel = message.sender_type === 'admin' ? 'Admin' : 
                                   message.sender_type === 'developer' ? 'Developer' : 'Buyer';
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[70%] ${
                        isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>
                          {isOwnMessage ? 'You' : senderLabel.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        {!isOwnMessage && (
                          <span className="text-xs font-medium text-muted-foreground px-1">
                            {senderLabel}
                          </span>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : message.sender_type === 'admin'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-background border'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-end space-x-2 pt-4 border-t">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[80px] resize-none"
            />
            <div className="flex flex-col space-y-2">
              <Button
                size="icon"
                variant="outline"
                disabled
                title="Attachments coming soon"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
