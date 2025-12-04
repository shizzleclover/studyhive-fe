"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  useUsers,
  useUpdateUserRole,
  useActivateUser,
  useDeactivateUser,
} from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronLeft, Shield, User, UserCheck, UserCog } from "lucide-react";

const roleLabel: Record<string, string> = {
  admin: "Admin",
  rep: "Rep",
  student: "Student",
};

const UsersAdminPage = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: activateUser, isPending: isActivating } = useActivateUser();
  const { mutate: deactivateUser, isPending: isDeactivating } = useDeactivateUser();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold mb-2">Admin access required</h1>
          <p className="text-sm text-muted-foreground">
            You need an administrator account to manage users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Admin
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">User Management</span>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Users & Roles</h2>
              <p className="text-xs text-muted-foreground">
                Promote reps, manage access, and keep your community safe.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading users...
            </div>
          ) : !users || users.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u._id}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/70 transition-colors",
                    u._id === currentUser._id && "border border-amber-500/50 bg-amber-50/40 dark:bg-amber-900/10"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xs font-semibold">
                      {u.name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{u.name}</span>
                        {u._id === currentUser._id && (
                          <Badge variant="outline" className="text-[10px]">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {u.email}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        <span>{roleLabel[u.role] ?? u.role}</span>
                        <span>•</span>
                        <span>{u.isActive ? "Active" : "Inactive"}</span>
                        <span>•</span>
                        <span>{u.reputationScore} rep</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdatingRole || u._id === currentUser._id}
                      onClick={() => updateRole({ id: u._id, data: { role: "student" } })}
                    >
                      <User className="h-3 w-3 mr-1" />
                      Student
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdatingRole || u._id === currentUser._id}
                      onClick={() => updateRole({ id: u._id, data: { role: "rep" } })}
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Rep
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdatingRole || u._id === currentUser._id}
                      onClick={() => updateRole({ id: u._id, data: { role: "admin" } })}
                    >
                      <UserCog className="h-3 w-3 mr-1" />
                      Admin
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        !u.isActive && "bg-emerald-50 dark:bg-emerald-900/20"
                      )}
                      disabled={isActivating || isDeactivating || u._id === currentUser._id}
                      onClick={() =>
                        u.isActive
                          ? deactivateUser(u._id)
                          : activateUser(u._id)
                      }
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UsersAdminPage;


