import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Settings, Bell, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export const SettingsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile(profileData);

      // Get notification preferences
      const { data: preferencesData } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setPreferences(preferencesData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          user_type: profile.user_type
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updateNotificationPreferences = async () => {
    if (!user || !preferences) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: preferences.email_notifications,
          push_notifications: preferences.push_notifications,
          milestone_updates: preferences.milestone_updates,
          project_status_updates: preferences.project_status_updates,
          daily_digest: preferences.daily_digest
        });

      if (error) throw error;

      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and user type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={profile?.display_name || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Enter your display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-type">User Type</Label>
                <Select 
                  value={profile?.user_type || 'buyer'} 
                  onValueChange={(value) => setProfile(prev => ({ ...prev, user_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="both">Both Buyer & Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={updateProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about project updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={preferences?.email_notifications || false}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, email_notifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch
                  checked={preferences?.push_notifications || false}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, push_notifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Milestone Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when project milestones are completed
                  </p>
                </div>
                <Switch
                  checked={preferences?.milestone_updates || false}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, milestone_updates: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Project Status Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when project status changes
                  </p>
                </div>
                <Switch
                  checked={preferences?.project_status_updates || false}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, project_status_updates: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily summary of your projects
                  </p>
                </div>
                <Switch
                  checked={preferences?.daily_digest || false}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, daily_digest: checked }))
                  }
                />
              </div>

              <Button onClick={updateNotificationPreferences} disabled={saving}>
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Account ID</Label>
                <Input
                  value={user?.id || ''}
                  disabled
                  className="bg-muted font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Created</Label>
                <Input
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowPasswordDialog(true)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ChangePasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        userEmail={user?.email || ''}
      />
    </div>
  );
};