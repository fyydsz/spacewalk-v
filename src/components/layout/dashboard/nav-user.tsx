"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"

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


export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, isAuthenticated, isLoading, logout, login, mode } = useAuth();

  // If not authenticated in production mode, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated && mode === 'production') {
      // Only redirect in production mode
      login();
    }
  }, [isLoading, isAuthenticated, mode]);

  const handleLogout = async () => {
    await logout();
    // In production, redirect to home page
    if (mode === 'production') {
      window.location.href = "https://www.spacewalk.my.id";
    }
  };

  // Show loading state
  if (isLoading) return null;
  
  // In development mode, always show user (from mock data)
  // In production mode, only show if authenticated
  if (!user && mode === 'production') return null;

  // Get avatar URL helper
  const getAvatarUrl = () => {
    if (user?.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`;
    }
    // Default Discord avatar
    const defaultAvatarIndex = user?.discriminator ? parseInt(user.discriminator) % 5 : 0;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  };

  const displayName = user?.globalName || user?.username || 'User';
  const displayEmail = user?.email || `${user?.username}@discord.com`;
  const avatarUrl = getAvatarUrl();
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

