"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  Brain, 
  Download,
  ThumbsUp,
  Bookmark
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { useQuery } from "@tanstack/react-query";
import { coursesService } from "@/lib/api/services/courses.service";
import { pastQuestionsService } from "@/lib/api/services/past-questions.service";
import { communityNotesService } from "@/lib/api/services/community-notes.service";
import { quizzesService } from "@/lib/api/services/quizzes.service";
import { userService } from "@/lib/api/services/user.service";
import { votesService } from "@/lib/api/services/votes.service";
import { PastQuestionType, CommunityNote, Quiz } from "@/lib/api/types";
import { useStudyFilters } from "@/hooks/use-study-filters";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

type TabType = "pq" | "notes" | "quizzes";

const CoursePage = ({ params }: CoursePageProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("pq");
  const [selectedPQType, setSelectedPQType] = useState<PastQuestionType | "all">("all");
  const { setCourse } = useStudyFilters();

  useEffect(() => {
    setCourse(params.courseId);
  }, [params.courseId, setCourse]);

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: () => coursesService.getCourseById(params.courseId),
  });

  const { data: pastQuestionsData, isLoading: isPQLoading } = useQuery({
    queryKey: ["past-questions", params.courseId, selectedPQType],
    queryFn: () =>
      pastQuestionsService.getByCourse(params.courseId, {
        type: selectedPQType === "all" ? undefined : selectedPQType,
        page: 1,
        limit: 25,
      }),
  });

  const {
    data: notesData,
    isLoading: isNotesLoading,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ["notes", params.courseId],
    queryFn: () => communityNotesService.getNotesByCourse(params.courseId, { limit: 50 }),
  });

  const { data: quizzesData, isLoading: isQuizzesLoading } = useQuery({
    queryKey: ["quizzes", params.courseId],
    queryFn: () => quizzesService.getQuizzesByCourse(params.courseId, { limit: 25 }),
  });

  const pastQuestions = pastQuestionsData?.data ?? [];
  const notes = (notesData?.data ?? []) as CommunityNote[];
  const quizzes = quizzesData?.data ?? ([] as Quiz[]);

  const pastQuestionTypes: { value: PastQuestionType | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "exam", label: "Exam" },
    { value: "mid-semester", label: "Mid Semester" },
    { value: "quiz", label: "Quiz" },
    { value: "assignment", label: "Assignment" },
    { value: "class-work", label: "Class Work" },
    { value: "group-project", label: "Group Project" },
    { value: "project", label: "Project" },
    { value: "tutorial", label: "Tutorial" },
  ];

  const getTypeLabel = (type: PastQuestionType): string => {
    const typeMap: Record<PastQuestionType, string> = {
      "exam": "Exam",
      "mid-semester": "Mid Semester",
      "quiz": "Quiz",
      "assignment": "Assignment",
      "class-work": "Class Work",
      "group-project": "Group Project",
      "project": "Project",
      "tutorial": "Tutorial",
    };
    return typeMap[type];
  };

  if (isCourseLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Course not found</h2>
          <Button className="mt-4" onClick={() => router.push("/levels")}>
            Back to Levels
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "pq" as TabType, label: "Past Questions", icon: FileText, count: pastQuestions.length },
    { id: "notes" as TabType, label: "Community Notes", icon: BookOpen, count: notes.length },
    { id: "quizzes" as TabType, label: "Quizzes", icon: Brain, count: quizzes.length },
  ];

  const handleDownload = async (pqId: string, fileName: string) => {
    try {
      const download = await pastQuestionsService.downloadPastQuestion(pqId);
      if (download?.downloadUrl) {
        window.open(download.downloadUrl, "_blank");
      }
      toast.success(`Downloading ${fileName}`);
    } catch (error: any) {
      toast.error(error?.message || "Unable to download file");
    }
  };

  const handleUpvote = async (noteId: string) => {
    try {
      await votesService.castVote({
        targetId: noteId,
        targetType: "CommunityNote",
        voteType: "upvote",
      });
      toast.success("Upvoted!");
      refetchNotes();
    } catch (error: any) {
      toast.error(error?.message || "Unable to upvote note");
    }
  };

  const handleSaveNote = async (noteId: string) => {
    try {
      await userService.saveNote(noteId);
      toast.success("Note saved!");
    } catch (error: any) {
      toast.error(error?.message || "Unable to save note");
    }
  };

  return (
    <div className="h-full">
      {/* Course Header */}
      <div className="bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/levels")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <IconRenderer iconName={course.icon} className="h-6 w-6 shrink-0" />
            <div>
              <h1 className="text-2xl font-semibold">{course.title}</h1>
              <p className="text-sm text-muted-foreground">{course.code} • {course.creditUnits} credits</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-muted rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Past Questions Tab */}
          {activeTab === "pq" && (
            <div className="space-y-4">
              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {pastQuestionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedPQType(type.value)}
                    className={cn(
                      "px-3 py-1 text-sm rounded-md transition-colors",
                      selectedPQType === type.value
                        ? "bg-foreground text-background"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {isPQLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading past questions...
                </div>
              ) : pastQuestions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">
                    {selectedPQType === "all" 
                      ? "No past questions available yet." 
                      : `No ${getTypeLabel(selectedPQType as PastQuestionType)} available.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {pastQuestions.map((pq) => (
                    <div
                      key={pq._id}
                      className="group min-h-[50px] px-4 py-3 w-full hover:bg-primary/5 flex items-center justify-between rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm">{pq.year} - {pq.semester} Semester</div>
                            <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
                              {getTypeLabel(pq.type)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(pq.fileSize / 1024 / 1024).toFixed(1)} MB • {pq.downloadCount} downloads
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDownload(pq._id, pq.fileName)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-2">
              {isNotesLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading notes...
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No community notes yet.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="group min-h-[50px] px-4 py-3 w-full hover:bg-primary/5 flex items-center justify-between rounded-md transition-colors cursor-pointer"
                      onClick={() => router.push(`/notes/${note._id}`)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {note.icon ? (
                          <span className="text-lg">{note.icon}</span>
                        ) : (
                          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{note.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {note.isPinned && <span>📌</span>}
                            <span>{note.upvotes} upvotes</span>
                            <span>•</span>
                            <span>{note.commentCount} comments</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleUpvote(note._id); }}>
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleSaveNote(note._id); }}>
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div className="space-y-2">
              {isQuizzesLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading quizzes...
                </div>
              ) : quizzes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No quizzes available for this course yet.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="group min-h-[50px] px-4 py-3 w-full hover:bg-primary/5 flex items-center justify-between rounded-md transition-colors cursor-pointer"
                      onClick={() => router.push(`/quizzes/${quiz._id}`)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Brain className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{quiz.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{quiz.timeLimitMins} mins</span>
                            <span>•</span>
                            <span>{quiz.attemptCount} attempts</span>
                            <span>•</span>
                            <span>Avg: {quiz.avgScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;

