
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, Database, Zap, Settings, LogOut } from "lucide-react";
import { useAuth } from './AuthProvider';
import { useToast } from "@/components/ui/use-toast";

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { state } = useSidebar();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      title: "Agents",
      icon: Bot,
      url: "/dashboard/agents",
      isActive: location.pathname === "/dashboard/agents" || location.pathname === "/dashboard"
    },
    {
      title: "Knowledge Base",
      icon: Database,
      url: "/dashboard/knowledge-base",
      isActive: location.pathname === "/dashboard/knowledge-base"
    },
    {
      title: "Actions",
      icon: Zap,
      url: "/dashboard/actions",
      isActive: location.pathname === "/dashboard/actions"
    }
  ];

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/8809dec6-f735-4a48-9a53-c8187d5533dd.png" 
            alt="ALEXAI Logo" 
            className={`transition-all duration-200 ${
              isCollapsed ? 'h-8 w-8' : 'h-10 w-10'
            }`}
          />
          {!isCollapsed && (
            <span className="text-xl font-bold text-sidebar-foreground ml-3">ALEXAI</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={item.isActive}
                    className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
            >
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className="bg-purple-600 text-white text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <span className="truncate ml-2">{user?.email}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => navigate('/dashboard/profile')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <SidebarNav />
        
        <main className="flex-1 overflow-auto">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="relative h-full">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900/80 to-purple-900/80 backdrop-blur-sm border-b border-white/10 p-4">
              <SidebarTrigger className="text-white hover:bg-white/10" />
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
