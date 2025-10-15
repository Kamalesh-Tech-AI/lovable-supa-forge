import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Clock, 
  Tag, 
  Code, 
  CheckCircle2,
  Circle,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const RequestDetailsPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
      fetchMilestones();

      // Set up real-time subscription for milestones
      const channel = supabase
        .channel('milestone-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'custom_request_milestones',
            filter: `request_id=eq.${requestId}`
          },
          () => {
            fetchMilestones();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [requestId]);

  const fetchRequestDetails = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_request_milestones')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.status === 'completed').length;
    return (completed / milestones.length) * 100;
  };

  const getTotalMilestoneAmount = () => {
    return milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  };

  if (loading) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="text-center">Request not found</div>
      </div>
    );
  }

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

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{request.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {request.description}
                </CardDescription>
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-sm text-muted-foreground">{request.budget_range}</p>
                </div>
              </div>
              
              {request.timeline && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Timeline</p>
                    <p className="text-sm text-muted-foreground">{request.timeline}</p>
                  </div>
                </div>
              )}
              
              {request.category && (
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground capitalize">{request.category.replace('-', ' ')}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {request.preferred_tech && (
              <>
                <Separator className="my-4" />
                <div className="flex items-start space-x-2">
                  <Code className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Preferred Technologies</p>
                    <p className="text-sm text-muted-foreground">{request.preferred_tech}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Progress Card */}
        {milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>
                {milestones.filter(m => m.status === 'completed').length} of {milestones.length} milestones completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={calculateProgress()} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">
                {calculateProgress().toFixed(0)}% Complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Milestones Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>
                  Track the progress of your custom project
                </CardDescription>
              </div>
              {milestones.length > 0 && (
                <div className="text-right">
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-lg font-bold">₹{getTotalMilestoneAmount().toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {milestones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No milestones defined yet.</p>
                <p className="text-sm mt-2">Milestones will appear here once your project is assigned to a developer.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {milestone.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">Milestone {index + 1}: {milestone.title}</h4>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                          )}
                        </div>
                        <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                          ₹{milestone.amount?.toLocaleString()}
                        </Badge>
                      </div>
                      
                      {milestone.progress_notes && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-md">
                          <p className="text-sm font-medium mb-1">Progress Notes</p>
                          <p className="text-sm text-muted-foreground">{milestone.progress_notes}</p>
                        </div>
                      )}
                      
                      {milestone.completed_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Completed on {new Date(milestone.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline"
            onClick={() => navigate(`/custom/messages/${requestId}`)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            View Messages
          </Button>
        </div>
      </div>
    </div>
  );
};
