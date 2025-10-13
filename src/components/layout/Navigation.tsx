import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, BarChart3, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ryzeLogo from "@/assets/ryze.png";
import { SidebarTrigger } from "@/components/ui/sidebar";
interface NavigationProps {
  user: SupabaseUser;
  onSignOut: () => void;
}
export const Navigation = ({
  user,
  onSignOut
}: NavigationProps) => {
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    if (user) {
      fetchNotificationCount();

      // Subscribe to real-time notifications
      const channel = supabase.channel('notifications').on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchNotificationCount();
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  const fetchNotificationCount = async () => {
    try {
      const {
        count
      } = await supabase.from('notifications').select('*', {
        count: 'exact',
        head: true
      }).eq('user_id', user.id).eq('read', false);
      setNotificationCount(count || 0);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };
  const getUserDisplayName = () => {
    return user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
  };
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };
  return <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <SidebarTrigger className="flex-shrink-0" />
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
              <img 
                src={ryzeLogo} 
                alt="RYZE Logo" 
                className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-lg object-cover flex-shrink-0"
              />
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
                RYZE
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
            {/* Notifications Bell */}
            <Link to="/notifications" className="relative flex-shrink-0">
              <Button variant="ghost" size="sm" className="relative h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0">
                <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                {notificationCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full p-0 flex-shrink-0">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
                    <AvatarImage src="" alt={getUserDisplayName()} />
                    <AvatarFallback className="text-[10px] sm:text-xs md:text-sm">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 sm:w-56 md:w-64 bg-background z-[100]" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm sm:text-base truncate">{getUserDisplayName()}</p>
                    <p className="w-[180px] sm:w-[220px] truncate text-xs sm:text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={onSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-sm">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>;
};
