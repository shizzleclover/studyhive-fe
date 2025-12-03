"use client";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { DocumentHeader } from "@/components/document-header";
import { Skeleton } from "@/components/ui/skeleton";
import { studyHiveApi } from "@/lib/studyhive-data";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";

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

  const [document, setDocument] = useState(studyHiveApi.notes.getById(params.documentId));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDocument(studyHiveApi.notes.getById(params.documentId));
  }, [params.documentId]);

  const onChange = (content: string) => {
    if (document) {
      const updated = studyHiveApi.notes.update(document._id, { content: content });
      if (updated) {
        setDocument(updated);
      }
    }
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

  if (!document) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <DocumentHeader documentId={document._id} title={document.title} />
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;

