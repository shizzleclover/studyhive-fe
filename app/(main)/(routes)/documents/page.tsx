"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateNote } from "@/hooks/use-community-notes";
import { useStudyFilters } from "@/hooks/use-study-filters";

const DocumentsPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuth();
  const { mutateAsync: createNote, isPending } = useCreateNote();
  const { lastCourseId } = useStudyFilters();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const onCreate = async () => {
    if (!lastCourseId) {
      toast.info("Select a course before creating a note from the sidebar.");
      return;
    }
    try {
      const newNote = await createNote({
        title: "Untitled",
        courseId: lastCourseId,
        content: "",
      });
      toast.success("New note created!");
      router.push(`/documents/${newNote._id}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create a new note.");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.name ? `${user.name}'s` : "Your"} StudyHive
      </h2>
      <Button onClick={onCreate} disabled={isPending}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
