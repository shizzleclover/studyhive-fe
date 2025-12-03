"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { studyHiveApi } from "@/lib/studyhive-data";
import { useSearch } from "@/hooks/use-search";
import { BookOpen, Brain, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SearchCommand = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  const courses = studyHiveApi.courses.getAll();
  const notes = studyHiveApi.notes.getByCourse(""); // Get all notes
  const quizzes = studyHiveApi.quizzes.getByCourse("");

  // Filter based on query
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  if (!isMounted) return null;

  return (
    <CommandDialog open={isOpen} onOpenChange={handleClose}>
      <CommandInput 
        placeholder="Search courses, notes, quizzes..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found. Try a different search term.</CommandEmpty>
        
        <CommandGroup heading="Courses">
          {filteredCourses.slice(0, 5).map((course) => (
            <CommandItem
              key={course._id}
              value={`course-${course._id}-${course.title}`}
              onSelect={() => {
                router.push(`/courses/${course._id}`);
                handleClose();
              }}
            >
              <span className="mr-2 text-lg">{course.icon}</span>
              <div className="flex-1">
                <span className="font-medium">{course.title}</span>
                <span className="ml-2 text-xs text-muted-foreground">{course.code}</span>
              </div>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => {
              router.push("/levels");
              handleClose();
            }}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Browse All Levels</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/leaderboard");
              handleClose();
            }}
          >
            <Brain className="mr-2 h-4 w-4" />
            <span>View Leaderboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/saved");
              handleClose();
            }}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Saved Notes</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
