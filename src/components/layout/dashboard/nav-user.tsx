"use client"

import axios from "axios"
// import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

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
  // const navigate = useNavigate();
  const [userData, setUserData] = useState<{ username: string; avatar: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://api.spacewalk.my.id/auth/me", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setUserData({
            username: response.data.user.username,
            avatar: `https://cdn.discordapp.com/avatars/${response.data.user.id}/${response.data.user.avatar}.png`,
            email: response.data.user.email,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error.response?.data || error.message);
        window.location.href = "https://api.spacewalk.my.id/auth/discord"; // Redirect ke halaman login
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("https://api.spacewalk.my.id/auth/logout", {}, { withCredentials: true });
      window.location.href = "https://www.spacewalk.my.id"; // Redirect ke halaman utama
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  if (loading) return null; // Optionally, you can show a loading spinner here
  if (!userData) return null; // Optionally, you can show an error message here
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
                <AvatarImage src={userData.avatar} alt={userData.username} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.username}</span>
                <span className="truncate text-xs">{userData.email}</span>
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
                  <AvatarImage src={userData.avatar} alt={userData.username} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.username}</span>
                  <span className="truncate text-xs">{userData.email}</span>
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

