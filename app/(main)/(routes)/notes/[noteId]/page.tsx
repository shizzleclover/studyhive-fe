"use client";

import { useState } from "react";
import { studyHiveApi, mockUsers } from "@/lib/studyhive-data";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Send
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { formatDate } from "@/lib/date-utils";
import { Input } from "@/components/ui/input";

interface NotePageProps {
  params: {
    noteId: string;
  };
}

const NotePage = ({ params }: NotePageProps) => {
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  
  const note = studyHiveApi.notes.getById(params.noteId);
  const comments = studyHiveApi.comments.getByNote(params.noteId);
  const course = note ? studyHiveApi.courses.getById(note.courseId) : null;
  const author = note ? mockUsers.find(u => u._id === note.authorId) : null;

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Note not found</h2>
          <Button className="mt-4" onClick={() => router.push("/documents")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleUpvote = () => {
    studyHiveApi.notes.upvote(note._id);
    toast.success("Upvoted!");
  };

  const handleDownvote = () => {
    studyHiveApi.notes.downvote(note._id);
    toast.success("Downvoted");
  };

  const handleSave = () => {
    studyHiveApi.notes.save(note._id);
    toast.success("Note saved!");
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    studyHiveApi.comments.create(note._id, newComment);
    setNewComment("");
    toast.success("Comment added!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-background sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.push("/documents")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Note Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">{note.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{author?.name}</span>
            <span>•</span>
            <span>{formatDate(note.createdAt)}</span>
            {course && (
              <>
                <span>•</span>
                <span>{course.code}</span>
              </>
            )}
          </div>
        </div>

        {/* Note Content */}
        <div 
          className="prose dark:prose-invert max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        {/* Actions Bar */}
        <div className="flex items-center gap-4 py-3 border-t border-b mb-6">
          <button 
            onClick={handleUpvote}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{note.upvotes}</span>
          </button>
          <button 
            onClick={handleDownvote}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{note.downvotes}</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bookmark className="h-4 w-4" />
            <span>{note.saves}</span>
          </button>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-lg">
              🎓
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <Button onClick={handleComment} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <IconRenderer iconName={comment.userAvatar || "User"} className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePage;

