"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, User, Trophy } from "lucide-react";

export const UserItem = () => {
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return { label: "Admin", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" };
      case "rep":
        return { label: "Rep", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
      default:
        return { label: "Student", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" };
    }
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-2 w-full hover:bg-primary/5 rounded-md transition-colors"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-xs font-semibold">
              {user?.name?.charAt(0) || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || (isAuthenticated ? "Student" : "Guest")}
              </p>
              {roleBadge && (
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </div>
              )}
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="p-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-lg font-semibold">
                {user.name?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Fetching profile...</div>
          )}
          
          {user && (
            <div className="flex items-center gap-4 mt-4 p-2 bg-muted rounded-lg">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">{user.reputationScore}</span>
                <span className="text-xs text-muted-foreground">rep</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {user.notesCreated} notes created
              </div>
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <User className="h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="gap-2 cursor-pointer text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
