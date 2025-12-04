"use client";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/use-upload";
import { useUpdateNote } from "@/hooks/use-community-notes";

export const CoverImageModal = () => {
  const params = useParams();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useCoverImage();
  const { mutateAsync: uploadFile } = useFileUpload();
  const { mutateAsync: updateNote } = useUpdateNote();

  const onChange = async (file?: File) => {
    if (!file || !params?.documentId) return;
    try {
      setIsSubmitting(true);
      setFile(file);
      const uploadResult = await uploadFile({
        file,
        folder: "notes",
      });

      await updateNote({
        id: params.documentId as string,
        data: { coverImage: uploadResult.downloadUrl },
      });

      toast.success("Cover image uploaded!");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload cover image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};

