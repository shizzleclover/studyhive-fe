"use client";

import { cn } from "@/lib/utils";
import { IconRenderer } from "@/components/icon-renderer";
import { useQuery } from "@tanstack/react-query";
import { leaderboardService } from "@/lib/api/services/leaderboard.service";
import { useAuth } from "@/hooks/use-auth";

const LeaderboardPage = () => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => leaderboardService.getLeaderboard(),
  });
  const { user } = useAuth();

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Top contributors in the StudyHive community
          </p>
        </div>

        <div className="space-y-1">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Loading leaderboard...
            </div>
          ) : (
            (leaderboard ?? []).map((entry) => {
              const entryKey = entry.user?._id || entry.rank;
              return (
            <div
              key={entryKey}
              className={cn(
                "group min-h-[60px] px-4 py-3 w-full hover:bg-primary/5 flex items-center gap-3 rounded-md transition-colors",
                entry.user?._id === user?._id && "bg-primary/5"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                {entry.rank}
              </div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs">{entry.user?.name?.charAt(0) ?? "?"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{entry.user?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {entry.notesCreated} notes • {entry.quizAverage ?? 0}% avg
                </div>
              </div>
              <div className="text-sm font-medium">{entry.reputationScore}</div>
            </div>
          );
          }))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

