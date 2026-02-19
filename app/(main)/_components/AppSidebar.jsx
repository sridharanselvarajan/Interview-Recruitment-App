"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarOptions } from "@/services/Contants";
import { Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar className="border-r border-indigo-100/60 bg-gradient-to-b from-white via-indigo-50/30 to-white shadow-xl">
      <SidebarHeader className="flex flex-col items-center p-6 gap-5">
        {/* Logo with glow */}
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={100}
            className="w-[140px] relative hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Create Interview Button */}
        <Link href="/dashboard/create-interview" passHref className="w-full">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl btn-shimmer text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
            <Plus className="w-4 h-4" />
            Create New Interview
            <Sparkles className="w-3.5 h-3.5 opacity-80" />
          </button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu className="space-y-1">
              {SidebarOptions.map((option, index) => {
                const isActive = path === option.path;
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={option.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-200"
                            : "hover:bg-indigo-50 text-gray-600 hover:text-indigo-700"
                        }`}
                      >
                        {/* Active indicator glow */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-100 rounded-xl" />
                        )}
                        <option.icon
                          className={`h-5 w-5 relative z-10 transition-transform duration-200 group-hover:scale-110 ${
                            isActive ? "text-white" : "text-gray-500 group-hover:text-indigo-600"
                          }`}
                        />
                        <span
                          className={`text-[14px] font-medium relative z-10 ${
                            isActive ? "text-white" : "text-gray-700 group-hover:text-indigo-700"
                          }`}
                        >
                          {option.name}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 relative z-10" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-indigo-100">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">AiCruiter © 2025</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;