"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { studyHiveApi } from "@/lib/studyhive-data";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DocumentsPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const user = studyHiveApi.auth.getCurrentUser();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const onCreate = () => {
    try {
      const newNote = studyHiveApi.notes.create({
        title: "Untitled",
        courseId: "",
        content: "",
      });
      toast.success("New note created!");
      router.push(`/documents/${newNote._id}`);
    } catch (error) {
      toast.error("Failed to create a new note.");
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
        Welcome to {user.name}&apos;s StudyHive
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
