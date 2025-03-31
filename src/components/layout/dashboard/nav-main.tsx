"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    expanded?: boolean; // Tambahkan properti expanded
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  // const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleClick = (url: string) => {
    // navigate(url);
    window.location.href = url;
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isPathActive = location.pathname === item.url;
          const shouldExpand = item.expanded || isPathActive; // Periksa apakah harus diperluas

          return item.items && item.items.length > 0 ? (
            <SidebarMenuItem key={item.title}>
              <Collapsible asChild defaultOpen={shouldExpand}>
                <div>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`group ${isPathActive ? "bg-blue-500! text-white!" : ""}`}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubPathActive = location.pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url} className={isSubPathActive ? "bg-blue-500! text-white!" : ""}>
                                {subItem.title}
                              </a>
                            </SidebarMenuSubButton>

                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault(); // Mencegah navigasi default jika pakai react-router
                    handleClick(item.url!);
                  }}
                  className={isPathActive ? "bg-blue-500! text-white!" : ""}
                >
                  {item.icon && <item.icon />}
                  {item.title}
                </a>
              </SidebarMenuButton>

            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}