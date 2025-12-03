"use client";

import { studyHiveApi } from "@/lib/studyhive-data";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { formatDate } from "@/lib/date-utils";

const TrashPage = () => {
  const router = useRouter();
  const archivedNotes = studyHiveApi.notes.getArchived();

  const handleRestore = (noteId: string) => {
    studyHiveApi.notes.restore(noteId);
    toast.success("Note restored");
  };

  const handleRemove = (noteId: string) => {
    if (confirm("Are you sure you want to permanently delete this note?")) {
      studyHiveApi.notes.remove(noteId);
      toast.success("Note permanently deleted");
    }
  };

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Trash</h1>
          <p className="text-sm text-muted-foreground">
            Deleted notes are kept for 30 days before being permanently removed
          </p>
        </div>

        {archivedNotes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No deleted notes</p>
          </div>
        ) : (
          <div className="space-y-1">
            {archivedNotes.map((note) => (
              <div
                key={note._id}
                className="group min-h-[60px] px-4 py-3 w-full hover:bg-primary/5 flex items-center justify-between rounded-md transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {note.icon ? (
                    <IconRenderer iconName={note.icon} className="h-5 w-5 shrink-0" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{note.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Deleted {formatDate(note.updatedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRestore(note._id)}
                    className="h-8"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restore
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(note._id)}
                    className="h-8 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashPage;

