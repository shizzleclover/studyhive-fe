"use client";

import { studyHiveApi } from "@/lib/studyhive-data";
import { cn } from "@/lib/utils";
import { IconRenderer } from "@/components/icon-renderer";

const LeaderboardPage = () => {
  const leaderboard = studyHiveApi.leaderboard.getGlobal();
  const currentUser = studyHiveApi.auth.getCurrentUser();

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
          {leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={cn(
                "group min-h-[60px] px-4 py-3 w-full hover:bg-primary/5 flex items-center gap-3 rounded-md transition-colors",
                entry.userId === currentUser._id && "bg-primary/5"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                {entry.rank}
              </div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                {entry.userAvatar ? (
                  <IconRenderer iconName={entry.userAvatar} className="h-4 w-4" />
                ) : (
                  <span className="text-xs">?</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{entry.userName}</div>
                <div className="text-xs text-muted-foreground">
                  {entry.noteCount} notes • {entry.quizAvgScore}% avg
                </div>
              </div>
              <div className="text-sm font-medium">{entry.reputationScore}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

