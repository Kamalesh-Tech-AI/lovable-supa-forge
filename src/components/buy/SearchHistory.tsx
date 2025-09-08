import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { History, Clock, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface SearchHistoryItem {
  id: string;
  search_query: string;
  search_filters: any;
  results_count: number;
  created_at: string;
}

interface SearchHistoryProps {
  onSelectHistory: (query: string, filters: any) => void;
  onClose: () => void;
}

export const SearchHistory = ({ onSelectHistory, onClose }: SearchHistoryProps) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast({
        title: "Error",
        description: "Failed to load search history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Search history item deleted.",
      });
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast({
        title: "Error",
        description: "Failed to delete history item.",
        variant: "destructive"
      });
    }
  };

  const clearAllHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory([]);
      
      toast({
        title: "Success",
        description: "All search history cleared.",
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error",
        description: "Failed to clear search history.",
        variant: "destructive"
      });
    }
  };

  const handleSelectHistory = (item: SearchHistoryItem) => {
    onSelectHistory(item.search_query, item.search_filters);
    onClose();
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Search History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Search History
          </CardTitle>
          {history.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No search history yet</p>
            <p className="text-sm text-muted-foreground">Your searches will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {history.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <Separator />}
                  <div 
                    className="cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                    onClick={() => handleSelectHistory(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-sm truncate">
                            {item.search_query || "All projects"}
                          </span>
                        </div>
                        
                        {item.search_filters && Object.keys(item.search_filters).length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.search_filters.category && item.search_filters.category !== 'all' && (
                              <Badge variant="secondary" className="text-xs">
                                {item.search_filters.category}
                              </Badge>
                            )}
                            {item.search_filters.priceRange && item.search_filters.priceRange !== 'all' && (
                              <Badge variant="secondary" className="text-xs">
                                ₹{item.search_filters.priceRange}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </div>
                          <span>{item.results_count} results</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryItem(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};