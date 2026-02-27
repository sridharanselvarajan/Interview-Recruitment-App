"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Moon, Phone, Plus, Sparkles, Sun, Video } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AppSidebar() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  const handleNavigation = (type) => {
    setOpen(false);
    router.push(`/dashboard/create-interview?type=${encodeURIComponent(type)}`);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Sidebar className="border-r border-indigo-100/60 dark:border-indigo-900/40 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 shadow-xl">
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

        {/* Create Interview Selection Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl btn-shimmer text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <Plus className="w-4 h-4" />
              Create New Interview
              <Sparkles className="w-3.5 h-3.5 opacity-80" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl border-none bg-white dark:bg-gray-900 p-0 overflow-hidden shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700">
              <DialogHeader className="text-white">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  Select Interview Type
                </DialogTitle>
                <DialogDescription className="text-indigo-100/80 text-sm mt-2">
                  Choose the best format for your candidate assessment
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 grid gap-4 bg-gray-50/50 dark:bg-gray-800/50">
              {/* Video Call Option */}
              <button
                onClick={() => handleNavigation('Video Call')}
                className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all duration-300 text-left"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Video className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Video Call</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Face-to-face technical & behavioral assessment</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Plus className="h-4 w-4" />
                </div>
              </button>

              {/* Phone Screening Option */}
              <button
                onClick={() => handleNavigation('Phone Screening')}
                className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all duration-300 text-left"
              >
                <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Phone Screening</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Quick screening via AI voice interaction</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Plus className="h-4 w-4" />
                </div>
              </button>
            </div>
          </DialogContent>
        </Dialog>
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
                            ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900"
                            : "hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-100 rounded-xl" />
                        )}
                        <option.icon
                          className={`h-5 w-5 relative z-10 transition-transform duration-200 group-hover:scale-110 ${
                            isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                          }`}
                        />
                        <span
                          className={`text-[14px] font-medium relative z-10 ${
                            isActive ? "text-white" : "text-gray-700 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
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

      <SidebarFooter className="p-4 border-t border-indigo-100 dark:border-indigo-900/40 space-y-3">
        {/* Dark / Light mode toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 group"
          >
            <span className="text-sm font-medium">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <div className="relative w-10 h-5 rounded-full bg-gray-200 dark:bg-indigo-600 transition-colors duration-300 flex items-center px-0.5">
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 flex items-center justify-center ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}>
                {theme === "dark"
                  ? <Moon className="w-2.5 h-2.5 text-indigo-600" />
                  : <Sun className="w-2.5 h-2.5 text-amber-500" />
                }
              </div>
            </div>
          </button>
        )}

        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">AiCruiter © 2025</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;