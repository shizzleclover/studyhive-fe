"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Search,
  Settings,
  GraduationCap,
  BookOpen,
  Brain,
  Trophy,
  MessageSquare,
  Bookmark,
  Home,
  ChevronRight,
  FileText,
  PlusCircle,
  Trash2,
  Timer,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { IconRenderer } from "@/components/icon-renderer";
import { useLevels } from "@/hooks/use-levels";
import { useCourses } from "@/hooks/use-courses";
import { useCreateNote } from "@/hooks/use-community-notes";
import { useStudyFilters } from "@/hooks/use-study-filters";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/services/user.service";
import { communityNotesService } from "@/lib/api/services/community-notes.service";
import { requestsService } from "@/lib/api/services/requests.service";
import { toast } from "sonner";
import { Course } from "@/lib/api/types";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  showBadge?: number;
  isSearchItem?: boolean;
}

const NavItem = ({ icon: Icon, label, onClick, isActive, showBadge, isSearchItem }: NavItemProps) => {
  if (!Icon) return null;
  
  return (
    <div
      role="button"
      onClick={onClick}
      className={cn(
        "group min-h-[36px] text-sm py-2 px-3 w-full hover:bg-primary/5 flex items-center gap-3 text-muted-foreground font-medium rounded-md transition-colors",
        isActive && "bg-primary/5 text-amber-600 dark:text-amber-400"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-amber-500")} />
      <span className="truncate flex-1">{label}</span>
      {isSearchItem && (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘K</span>
        </kbd>
      )}
      {showBadge !== undefined && showBadge > 0 && (
        <span className="px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
          {showBadge}
        </span>
      )}
    </div>
  );
};

export const Navigation = () => {
  const router = useRouter();
  const search = useSearch();
  const settings = useSettings();
  const pathname = usePathname();
  const isMobileQuery = useMediaQuery("(max-width: 768px)");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: levelsData } = useLevels();
  const { data: coursesData } = useCourses();
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
  const { lastCourseId, lastLevelId, setCourse, setLevel } = useStudyFilters();
  const { mutateAsync: createNote, isPending: isCreatingNote } = useCreateNote();

  const { data: savedNotes } = useQuery({
    queryKey: ["saved-notes"],
    queryFn: () => userService.getSavedNotes(),
  });

  const { data: archivedNotes } = useQuery({
    queryKey: ["archived-notes"],
    queryFn: () => communityNotesService.getMyNotes({ status: "archived", limit: 50 }),
  });

  const { data: pendingRequests } = useQuery({
    queryKey: ["requests", "pending"],
    queryFn: () => requestsService.getRequests({ status: "pending", limit: 50, page: 1 }),
  });

  const coursesByLevel = useMemo(() => {
    const list = Array.isArray(coursesData)
      ? coursesData
      : (coursesData as any)?.data ?? [];
    if (!list.length) return {} as Record<string, Course[]>;
    return list.reduce((acc: Record<string, Course[]>, course: Course) => {
      const levelId = typeof course.level === "string" ? course.level : (course.level as any)?._id;
      if (!levelId) return acc;
      if (!acc[levelId]) acc[levelId] = [];
      acc[levelId].push(course);
      return acc;
    }, {} as Record<string, Course[]>);
  }, [coursesData]);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(isMobileQuery);
    setIsCollapsed(isMobileQuery);
  }, [isMobileQuery]);

  useEffect(() => {
    if (!mounted) return;
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile, mounted]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 400) newWidth = 400;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current) {
      setIsCollapsed(false);
      sidebarRef.current.style.width = isMobile ? "100%" : "260px";

      if (navbarRef.current && !isMobile) {
        navbarRef.current.style.setProperty("width", "calc(100% - 260px)");
        navbarRef.current.style.setProperty("left", "260px");
      }
    }
  };

  const collapse = () => {
    if (sidebarRef.current) {
      setIsCollapsed(true);
      sidebarRef.current.style.width = "0";

      if (navbarRef.current && !isMobile) {
        navbarRef.current.style.setProperty("width", "100%");
        navbarRef.current.style.setProperty("left", "0");
      }
    }
  };

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => ({ ...prev, [levelId]: !prev[levelId] }));
    setLevel(levelId);
  };

  const handleCreateNote = async () => {
    if (!lastCourseId) {
      toast.info("Select a course before creating a note.");
      return;
    }
    try {
      const note = await createNote({
        courseId: lastCourseId,
        title: "Untitled note",
        content: "",
      });
      toast.success("New note created");
      router.push(`/documents/${note._id}`);
    } catch (error: any) {
      toast.error(error?.message || "Unable to create note");
    }
  };

  if (!mounted) {
    return (
      <aside className="group/sidebar h-full bg-secondary overflow-y-auto relative flex w-[260px] flex-col z-[99999]">
        <div className="p-4 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg">
            Study<span className="text-amber-500">Hive</span>
          </span>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-[260px] flex-col z-[99999] transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        {/* Collapse Button */}
        <div
          role="button"
          onClick={collapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg">
            Study<span className="text-amber-500">Hive</span>
          </span>
        </div>

        {/* User Item */}
        <div className="px-3">
          <UserItem />
        </div>

        {/* Main Navigation */}
        <div className="px-3 mt-4">
          <NavItem 
            icon={Search} 
            label="Search" 
            isSearchItem 
            onClick={search.onOpen}
          />
          <NavItem 
            icon={Home} 
            label="Home" 
            onClick={() => router.push("/documents")}
            isActive={pathname === "/documents" || pathname === "/levels"}
          />
          <NavItem 
            icon={PlusCircle} 
            label="New Page" 
            onClick={handleCreateNote}
            isActive={isCreatingNote}
          />
        </div>

        {/* Levels Section */}
        <div className="px-3 mt-6">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-3 uppercase tracking-wider">
            Levels
          </div>
          {(
            Array.isArray(levelsData)
              ? levelsData
              : (levelsData as any)?.data ?? []
          ).map((level) => {
            const courses = coursesByLevel[level._id] ?? [];
            const isExpanded = expandedLevels[level._id] ?? level._id === lastLevelId;
            
            return (
              <div key={level._id}>
                <div
                  role="button"
                  onClick={() => toggleLevel(level._id)}
                  className="group min-h-[36px] text-sm py-2 px-3 w-full hover:bg-primary/5 flex items-center gap-2 text-muted-foreground font-medium rounded-md transition-colors"
                >
                  <ChevronRight 
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform",
                      isExpanded && "rotate-90"
                    )} 
                  />
                  <IconRenderer iconName={level.icon} className="h-4 w-4 shrink-0" />
                  <span className="truncate flex-1">{level.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {courses.length}
                  </span>
                </div>
                
                {isExpanded && (
                  <div className="ml-4 border-l pl-2">
                    {courses.map((course) => (
                      <div
                        key={course._id}
                        role="button"
                        onClick={() => {
                          setCourse(course._id);
                          router.push(`/courses/${course._id}`);
                        }}
                        className={cn(
                          "min-h-[32px] text-sm py-1.5 px-3 w-full hover:bg-primary/5 flex items-center gap-2 text-muted-foreground rounded-md transition-colors cursor-pointer",
                          pathname === `/courses/${course._id}` && "bg-primary/5 text-amber-600 dark:text-amber-400"
                        )}
                      >
                        <IconRenderer iconName={course.icon} className="h-4 w-4 shrink-0" />
                        <span className="truncate text-xs">{course.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Access */}
        <div className="px-3 mt-6">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-3 uppercase tracking-wider">
            Quick Access
          </div>
          <NavItem 
            icon={Bookmark} 
            label="Saved Notes" 
            onClick={() => router.push("/saved")}
            showBadge={savedNotes?.length}
          />
          <NavItem 
            icon={Trash2} 
            label="Trash" 
            onClick={() => router.push("/trash")}
            showBadge={archivedNotes?.pagination?.totalItems}
          />
          <NavItem 
            icon={Timer} 
            label="Study Timer" 
            onClick={() => router.push("/timer")}
            isActive={pathname === "/timer"}
          />
          <NavItem 
            icon={Brain} 
            label="My Quiz History" 
            onClick={() => router.push("/quiz-history")}
          />
          <NavItem 
            icon={Trophy} 
            label="Leaderboard" 
            onClick={() => router.push("/leaderboard")}
          />
          <NavItem 
            icon={MessageSquare} 
            label="Requests" 
            onClick={() => router.push("/requests")}
            showBadge={pendingRequests?.pagination?.total}
          />
        </div>

        {/* Settings */}
        <div className="px-3 mt-auto mb-4">
          <NavItem 
            icon={Settings} 
            label="Settings" 
            onClick={settings.onOpen}
          />
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      {/* Floating hamburger only, no header bar */}
      {!pathname?.includes("/documents/") && isCollapsed && (
        <button
          type="button"
          onClick={resetWidth}
          className="fixed top-3 left-3 z-[99999] p-2 text-muted-foreground hover:text-foreground"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      )}
    </>
  );
};
