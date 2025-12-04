"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { IconRenderer } from "@/components/icon-renderer";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/services/user.service";
import { communityNotesService } from "@/lib/api/services/community-notes.service";

const SavedNotesPage = () => {
  const router = useRouter();
  const { data: savedRefs, isLoading } = useQuery({
    queryKey: ["saved-notes"],
    queryFn: () => userService.getSavedNotes(),
  });
  const noteIds = savedRefs?.map((ref) => ref.noteId) ?? [];
  const { data: savedNotes, isLoading: isNotesLoading } = useQuery({
    queryKey: ["saved-note-details", noteIds.join(",")],
    queryFn: async () => {
      const notes = await Promise.all(noteIds.map((id) => communityNotesService.getNoteById(id)));
      return notes;
    },
    enabled: noteIds.length > 0,
  });
  const isEmpty = !noteIds.length;

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Saved Notes</h1>
          <p className="text-sm text-muted-foreground">
            Your collection of bookmarked study materials
          </p>
        </div>

        {isLoading || isNotesLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading saved notes...
          </div>
        ) : isEmpty ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No saved notes yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {(savedNotes ?? []).map((note) => {
              return (
                <div
                  key={note._id}
                  onClick={() => router.push(`/notes/${note._id}`)}
                  className="group min-h-[50px] px-4 py-3 w-full hover:bg-primary/5 flex items-center gap-3 rounded-md transition-colors cursor-pointer"
                >
                  {note.icon ? (
                    <IconRenderer iconName={note.icon} className="h-5 w-5 shrink-0" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{note.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {typeof note.courseId === "string" ? "" : note.courseId?.code} • {note.upvotes} upvotes • {note.commentCount} comments
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedNotesPage;

