"use client";

import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useUpdateNote } from "@/hooks/use-community-notes";
import { toast } from "sonner";
import { CommunityNote } from "@/lib/api/types";
import { useDebounce } from "usehooks-ts";

interface ToolbarProps {
  initialData: Pick<CommunityNote, "_id" | "title" | "icon" | "coverImage">;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const debouncedValue = useDebounce(value, 400);

  const coverImage = useCoverImage();
  const { mutateAsync: updateNote } = useUpdateNote();

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (next: string) => {
    setValue(next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = async (icon: string) => {
    try {
      await updateNote({
        id: initialData._id,
        data: { icon },
      });
      toast.success("Icon updated");
    } catch (error: any) {
      toast.error(error?.message || "Unable to update icon");
    }
  };

  const onRemoveIcon = async () => {
    try {
      await updateNote({
        id: initialData._id,
        data: { icon: "" },
      });
    } catch (error: any) {
      toast.error(error?.message || "Unable to remove icon");
    }
  };

  const [lastPersisted, setLastPersisted] = useState(initialData.title);

  useEffect(() => {
    setValue(initialData.title);
    setLastPersisted(initialData.title);
  }, [initialData._id, initialData.title]);

  useEffect(() => {
    if (preview) return;
    if (debouncedValue === lastPersisted) return;
    setLastPersisted(debouncedValue);
    const nextTitle = debouncedValue || "Untitled";
    updateNote({
      id: initialData._id,
      data: { title: nextTitle },
    }).catch((error: any) => {
      toast.error(error?.message || "Unable to update title");
    });
  }, [debouncedValue, lastPersisted, preview, updateNote, initialData._id]);

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};

