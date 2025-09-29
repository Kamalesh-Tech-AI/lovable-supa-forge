import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Heart, 
  ShoppingCart, 
  Upload, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Star,
  DollarSign,
  Eye,
  Image
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectDetailsModal } from "@/components/buy/ProjectDetailsModal";

export const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userPurchases, setPurchases] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          setUserProfile(profile);

          // Get user's projects if they're a seller
          if (profile?.role === 'seller') {
            const { data: projects } = await supabase
              .from('projects')
              .select('*')
              .eq('seller_id', user.id)
              .order('created_at', { ascending: false });
            
            setUserProjects(projects || []);
          }

          // Get user's purchases
          const { data: purchases } = await supabase
            .from('purchases')
            .select(`
              *,
              projects:project_id(title, category, price_inr)
            `)
            .eq('buyer_id', user.id)
            .order('purchased_at', { ascending: false });
          
          setPurchases(purchases || []);

          // Get user's liked projects
          const { data: likes } = await supabase
            .from('project_likes')
            .select(`
              *,
              projects:project_id(title, price_inr, category, profiles:seller_id(display_name))
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          setUserLikes(likes || []);

          // Get user's custom requests
          const { data: requests } = await supabase
            .from('custom_requests')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          setUserRequests(requests || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const buyerStats = {
    totalPurchases: userPurchases.length,
    totalSpent: userPurchases.reduce((total, purchase) => total + (purchase.amount_paid || 0), 0),
    activeCustomProjects: userRequests.filter(req => req.status === 'in_progress').length,
    likedProjects: userLikes.length
  };

  const sellerStats = {
    totalProjects: userProjects.length,
    totalEarnings: userPurchases.reduce((total, purchase) => total + (purchase.amount_paid || 0), 0),
    totalDownloads: userPurchases.length,
    averageRating: 4.8 // This would come from reviews in a real app
  };

  const handlePreviewProject = (likedProject) => {
    // Transform the liked project data to match the expected format
    const projectData = {
      ...likedProject.projects,
      seller: {
        display_name: likedProject.projects?.profiles?.display_name || 'Unknown Seller'
      },
      rating: 4.8, // Default rating
      downloads: Math.floor(Math.random() * 200) + 50 // Mock downloads
    };
    setSelectedProject(projectData);
    setShowDetailsModal(true);
  };
  const BuyerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{buyerStats.totalPurchases}</p>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">₹{buyerStats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{buyerStats.activeCustomProjects}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{buyerStats.likedProjects}</p>
                <p className="text-sm text-muted-foreground">Liked Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="purchases" className="space-y-6">
        <TabsList>
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
          <TabsTrigger value="liked">Liked Projects</TabsTrigger>
          <TabsTrigger value="custom">Custom Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="space-y-4">
          {userPurchases.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No purchases yet.</p>
              </CardContent>
            </Card>
          ) : (
            userPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{purchase.projects?.title}</h3>
                      <p className="text-muted-foreground">
                        Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        ₹{purchase.amount_paid?.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {purchase.status}
                      </Badge>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="liked" className="space-y-4">
          {userLikes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No liked projects yet.</p>
              </CardContent>
            </Card>
          ) : (
            userLikes.map((like) => (
              <Card key={like.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                      <h3 className="font-semibold text-lg">{like.projects?.title}</h3>
                      <p className="text-muted-foreground">by {like.projects?.profiles?.display_name}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.8</span>
                      </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary mb-2">
                        ₹{like.projects?.price_inr?.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handlePreviewProject(like)}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          {userRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No custom requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            userRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <p className="text-muted-foreground">Budget: {request.budget_range}</p>
                        <p className="text-sm text-muted-foreground">Created: {new Date(request.created_at).toLocaleDateString()}</p>
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

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Timeline: {request.timeline || 'Not specified'}</span>
                      <Button>View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const SellerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{userProjects.length}</p>
                <p className="text-sm text-muted-foreground">Projects Listed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">₹{sellerStats.totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{sellerStats.totalDownloads}</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{sellerStats.averageRating}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>Manage your project listings</CardDescription>
        </CardHeader>
        <CardContent>
          {userProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No projects yet. Start by uploading your first project!
            </p>
          ) : (
            <div className="space-y-4">
              {userProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                    <p className="text-lg font-bold text-primary">₹{project.price_inr?.toLocaleString()}</p>
                  </div>
                  <Badge variant={
                    project.status === 'approved' ? 'default' : 
                    project.status === 'pending' ? 'secondary' :
                    'outline'
                  }>
                    {project.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your activity.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : !user ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
        </div>
      ) : userProfile?.role === "seller" ? (
        <SellerDashboard />
      ) : (
        <BuyerDashboard />
      )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
};