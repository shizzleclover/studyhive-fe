"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Layers, BookOpenCheck } from "lucide-react";

const AdminDashboardPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold mb-2">Admin access required</h1>
          <p className="text-sm text-muted-foreground">
            You need an administrator account to view the management dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Admin Console
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage users, academic structure, and global content across StudyHive.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className="cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => router.push("/admin/users")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-500" />
                    Users & Roles
                  </CardTitle>
                  <CardDescription>
                    Promote reps, manage access, and adjust reputation.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => router.push("/admin/academic")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-amber-500" />
                    Academic Setup
                  </CardTitle>
                  <CardDescription>
                    Configure levels and courses for your institution.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-amber-500" />
                Moderation Overview
              </CardTitle>
              <CardDescription>
                Use the Requests, Leaderboard, and course pages to review content and recognise top contributors.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/requests")}>
              Review Requests
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;


