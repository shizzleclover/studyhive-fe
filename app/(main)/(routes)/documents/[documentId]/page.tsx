"use client";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { DocumentHeader } from "@/components/document-header";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import { useCommunityNote, useUpdateNote } from "@/hooks/use-community-notes";
import { useDebounce } from "usehooks-ts";
import { toast } from "sonner";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const { data: document, isLoading, isError } = useCommunityNote(params.documentId);
  const { mutateAsync: updateNote } = useUpdateNote();
  const [content, setContent] = useState("");
  const debouncedContent = useDebounce(content, 600);

  useEffect(() => {
    if (document) {
      setContent(document.content || "");
    }
  }, [document?._id, document?.content]);

  useEffect(() => {
    if (!document) return;
    if (debouncedContent === document.content) return;
    updateNote({
      id: document._id,
      data: { content: debouncedContent },
    }).catch((error: any) => {
      toast.error(error?.message || "Unable to save content");
    });
  }, [debouncedContent, document, updateNote]);

  const onChange = (nextContent: string) => {
    setContent(nextContent);
  };

  if (isLoading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        Document not found.
      </div>
    );
  }

  return (
    <div className="pb-40">
      <DocumentHeader documentId={document._id} title={document.title} />
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;

