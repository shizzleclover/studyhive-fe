"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { BookOpen, Brain, GraduationCap, Loader2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/lib/api/services/search.service";
import { useCourses } from "@/hooks/use-courses";
import { GlobalSearchResult } from "@/lib/api/types";

export const SearchCommand = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  const { data: defaultCourses } = useCourses({ limit: 5 });

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ["global-search", query],
    queryFn: () => searchService.globalSearch({ q: query, limit: 5, page: 1 }),
    enabled: query.trim().length >= 2,
  });

  const resultsToRender: GlobalSearchResult | null = useMemo(() => {
    if (query.trim().length < 2) {
      return defaultCourses
        ? {
            courses: defaultCourses,
            notes: [],
            quizzes: [],
            pastQuestions: [],
            users: [],
          }
        : null;
    }
    return searchResults ?? null;
  }, [defaultCourses, query, searchResults]);

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
        <CommandEmpty>
          {query.trim().length < 2
            ? "Type at least 2 characters to search"
            : "No results found. Try refining your query."}
        </CommandEmpty>

        {isFetching && (
          <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching StudyHive...
          </div>
        )}

        {(() => {
          const list = resultsToRender?.courses;
          const courses = Array.isArray(list) ? list : (list as any)?.data ?? [];
          return courses.length
            ? (
          <CommandGroup heading="Courses">
            {courses.map((course) => (
              <CommandItem
                key={course._id}
                value={`course-${course._id}-${course.title}`}
                onSelect={() => {
                  router.push(`/courses/${course._id}`);
                  handleClose();
                }}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <span className="font-medium">{course.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{course.code}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
            )
            : null;
        })()}

        {(() => {
          const list = resultsToRender?.notes;
          const notes = Array.isArray(list) ? list : (list as any)?.data ?? [];
          return notes.length
            ? (
          <CommandGroup heading="Notes">
            {notes.map((note) => (
              <CommandItem
                key={note._id}
                value={`note-${note._id}-${note.title}`}
                onSelect={() => {
                  router.push(`/documents/${note._id}`);
                  handleClose();
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <span className="font-medium">{note.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {typeof note.courseId === "string" ? "" : note.courseId?.code}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
            )
            : null;
        })()}

        {(() => {
          const list = resultsToRender?.quizzes;
          const quizzes = Array.isArray(list) ? list : (list as any)?.data ?? [];
          return quizzes.length
            ? (
          <CommandGroup heading="Quizzes">
            {quizzes.map((quiz) => (
              <CommandItem
                key={quiz._id}
                value={`quiz-${quiz._id}-${quiz.title}`}
                onSelect={() => {
                  router.push(`/quizzes/${quiz._id}`);
                  handleClose();
                }}
              >
                <Brain className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <span className="font-medium">{quiz.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {typeof quiz.courseId === "string" ? "" : quiz.courseId?.code}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
            )
            : null;
        })()}

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
