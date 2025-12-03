"use client";

import { studyHiveApi } from "@/lib/studyhive-data";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { IconRenderer } from "@/components/icon-renderer";

const SavedNotesPage = () => {
  const router = useRouter();
  const savedNotes = studyHiveApi.notes.getSaved();

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Saved Notes</h1>
          <p className="text-sm text-muted-foreground">
            Your collection of bookmarked study materials
          </p>
        </div>

        {savedNotes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No saved notes yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {savedNotes.map((note) => {
              const course = studyHiveApi.courses.getById(note.courseId);
              
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
                      {course?.code} • {note.upvotes} upvotes • {note.commentCount} comments
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

