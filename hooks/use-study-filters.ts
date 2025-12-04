"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudyFilterState {
  lastLevelId?: string;
  lastCourseId?: string;
  setLevel: (levelId?: string) => void;
  setCourse: (courseId?: string) => void;
}

export const useStudyFilters = create<StudyFilterState>()(
  persist(
    (set) => ({
      lastLevelId: undefined,
      lastCourseId: undefined,
      setLevel: (levelId) => set({ lastLevelId: levelId }),
      setCourse: (courseId) => set({ lastCourseId: courseId }),
    }),
    {
      name: "study-hive-filters",
    }
  )
);


