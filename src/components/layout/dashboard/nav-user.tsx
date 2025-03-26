"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
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
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function NavUser() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [user_dc, setUser] = useState<{ username: string; avatar: string; email: string } | null>(null);

  useEffect(() => {
    axios
      .get("https://api.spacewalk.my.id/auth/me", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setUser({
            username: response.data.user.username,
            avatar: `https://cdn.discordapp.com/avatars/${response.data.user.id}/${response.data.user.avatar}.png`,
            email: response.data.user.email
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error.response?.data || error.message);
        window.location.href = "https://api.spacewalk.my.id/auth/discord";
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("https://api.spacewalk.my.id/auth/logout", {}, { withCredentials: true });
      window.location.href = "https://www.spacewalk.my.id"; // Redirect ke halaman login
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const handleGoToAccount = async () => {
    try {
      navigate("/dashboard/account")
    } catch (err: any) {
      console.error(err)
    }
  }

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
                <AvatarImage src={user_dc?.avatar} alt={user_dc?.username} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user_dc?.username}</span>
                <span className="truncate text-xs">{user_dc?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user_dc?.avatar} alt={user_dc?.username || "Test"} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user_dc?.username || "Test"}</span>
                  <span className="truncate text-xs">{user_dc?.email || "test@example.com"}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleGoToAccount}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
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
