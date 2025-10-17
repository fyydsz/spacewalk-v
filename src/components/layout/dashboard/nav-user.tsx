"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import axios from "axios"

import {
  BadgeCheck,
  // Bell,
  ChevronsUpDown,
  // CreditCard,
  LogOut,
  // Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"


export function NavUser() {
  const { isMobile } = useSidebar();
  const { mode, logout: authLogout, login: authLogin } = useAuth();
  const [userData, setUserData] = useState<{ username: string; avatar: string; email: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Discord JWT (production) or use mock data (development)
  useEffect(() => {
    const fetchUserData = async () => {
      if (mode === 'development') {
        // Development mode - use mock data
        setUserData({
          username: 'MockUser',
          avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
          email: 'mockuser@discord.com',
          id: '123456789',
        });
        setLoading(false);
      } else {
        // Production mode - fetch from Discord API
        try {
          const response = await axios.get('https://api.spacewalk.my.id/auth/me', { 
            withCredentials: true 
          });
          
          if (response.data.success) {
            setUserData({
              username: response.data.user.username,
              avatar: `https://cdn.discordapp.com/avatars/${response.data.user.id}/${response.data.user.avatar}.png`,
              email: response.data.user.email,
              id: response.data.user.id,
            });
          } else {
            // Not authenticated, redirect to login
            authLogin();
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Not authenticated, redirect to login in production
          authLogin();
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [mode, authLogin]);

  const handleLogout = async () => {
    if (mode === 'production') {
      // Production mode - call real logout API
      try {
        await axios.post('https://api.spacewalk.my.id/auth/logout', {}, { 
          withCredentials: true 
        });
      } catch (error) {
        console.error('Logout failed:', error);
      }
      window.location.href = "https://www.spacewalk.my.id";
    } else {
      // Development mode - just clear and use auth context
      await authLogout();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="cursor-default">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="ml-auto h-4 w-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  
  // If no user data, don't show (only happens in production if not authenticated)
  if (!userData) return null;

  const displayName = userData.username;
  const displayEmail = userData.email;
  const avatarUrl = userData.avatar;
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{displayEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{displayEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account Profile
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <CreditCard />
                Profile
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

