"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { useSettings } from "@/hooks/use-settings";
import { studyHiveApi } from "@/lib/studyhive-data";

export const SettingsModal = () => {
  const settings = useSettings();
  const user = studyHiveApi.auth.getCurrentUser();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">Settings</h2>
        </DialogHeader>
        
        {/* Profile Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl">
              {user.avatar}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <Label>Appearance</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                Customize how StudyHive looks on your device
              </span>
            </div>
            <ModeToggle />
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              StudyHive v1.0.0 - Where students thrive together 🐝
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
