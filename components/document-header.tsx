"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { studyHiveApi } from "@/lib/studyhive-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DocumentHeaderProps {
  documentId: string;
  title: string;
}

export const DocumentHeader = ({ documentId, title }: DocumentHeaderProps) => {
  const router = useRouter();

  const handleDelete = () => {
    studyHiveApi.notes.archive(documentId);
    toast.success("Note moved to trash");
    router.push("/documents");
  };

  const handlePublish = () => {
    toast.success("Note published");
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground font-medium">
          {title || "Untitled"}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePublish}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Publish
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete}>
                Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

