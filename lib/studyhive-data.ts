// StudyHive Mock Data and Types

// ============ TYPES ============

export type UserRole = "student" | "rep" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  reputationScore: number;
  savedNotes: string[];
  assignedCourses: string[];
  avatar?: string;
  createdAt: string;
}

export interface Level {
  _id: string;
  name: string;
  description: string;
  courses: string[];
  icon: string; // Icon name from lucide-react
  studentCount: number;
}

export interface Course {
  _id: string;
  title: string;
  code: string;
  department: string;
  creditUnits: number;
  semesterOffered: "First" | "Second" | "Both";
  levels: string[];
  description: string;
  icon: string; // Icon name from lucide-react
  resourceCount: {
    pastQuestions: number;
    notes: number;
    quizzes: number;
  };
  createdBy: string;
  createdAt: string;
}

export type PastQuestionType = 
  | "exam" 
  | "mid-semester" 
  | "quiz" 
  | "assignment" 
  | "class-work" 
  | "group-project" 
  | "project" 
  | "tutorial";

export interface PastQuestion {
  _id: string;
  courseId: string;
  year: number;
  semester: "First" | "Second";
  type: PastQuestionType;
  fileURL: string;
  fileName: string;
  uploadedBy: string;
  fileSize: number;
  fileType: string;
  downloadCount: number;
  createdAt: string;
}

export interface CommunityNote {
  _id: string;
  authorId: string;
  courseId: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  saves: number;
  commentCount: number;
  isPinned: boolean;
  isArchived?: boolean;
  score: number;
  tags: string[];
  icon?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for document editor compatibility
export type MockDocument = CommunityNote;

export interface Comment {
  _id: string;
  noteId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Quiz {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimitMins: number;
  attemptCount: number;
  avgScore: number;
  createdBy: string;
  createdAt: string;
}

export interface QuizQuestion {
  _id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: string;
}

export interface Request {
  _id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  type: "pq" | "notes" | "quiz";
  message: string;
  status: "pending" | "resolved" | "dismissed";
  resolvedBy?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  reputationScore: number;
  noteCount: number;
  quizAvgScore: number;
}

// ============ MOCK DATA ============

export const mockCurrentUser: User = {
  _id: "user001",
  name: "Alex Johnson",
  email: "alex@university.edu",
  role: "student",
  isVerified: true,
  reputationScore: 156,
  savedNotes: ["note001", "note003"],
  assignedCourses: [],
  avatar: "User",
  createdAt: "2024-09-01T10:00:00Z",
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    _id: "user002",
    name: "Sarah Chen",
    email: "sarah@university.edu",
    role: "rep",
    isVerified: true,
    reputationScore: 342,
    savedNotes: [],
    assignedCourses: ["CSC401", "CSC402"],
    avatar: "UserCircle",
    createdAt: "2024-08-15T10:00:00Z",
  },
  {
    _id: "user003",
    name: "Mike Brown",
    email: "mike@university.edu",
    role: "student",
    isVerified: true,
    reputationScore: 89,
    savedNotes: ["note002"],
    assignedCourses: [],
    avatar: "User",
    createdAt: "2024-09-10T10:00:00Z",
  },
  {
    _id: "admin001",
    name: "Dr. Williams",
    email: "admin@university.edu",
    role: "admin",
    isVerified: true,
    reputationScore: 500,
    savedNotes: [],
    assignedCourses: [],
    avatar: "Shield",
    createdAt: "2024-01-01T10:00:00Z",
  },
];

export const mockLevels: Level[] = [
  {
    _id: "level400",
    name: "400 Level",
    description: "Final year Computer Science courses and capstone projects",
    courses: ["CSC401", "CSC402", "CSC403", "CSC404", "CSC405", "CSC499"],
    icon: "GraduationCap",
    studentCount: 210,
  },
];

export const mockCourses: Course[] = [
  {
    _id: "CSC401",
    title: "Software Engineering",
    code: "CSC 401",
    department: "Computer Science",
    creditUnits: 4,
    semesterOffered: "First",
    levels: ["400L"],
    description: "Principles of software development, design patterns, and project management",
    icon: "Code",
    resourceCount: { pastQuestions: 12, notes: 28, quizzes: 6 },
    createdBy: "admin001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "CSC402",
    title: "Computer Networks",
    code: "CSC 402",
    department: "Computer Science",
    creditUnits: 4,
    semesterOffered: "First",
    levels: ["400L"],
    description: "Network protocols, architectures, and distributed systems",
    icon: "Globe",
    resourceCount: { pastQuestions: 10, notes: 24, quizzes: 5 },
    createdBy: "admin001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "CSC403",
    title: "Artificial Intelligence",
    code: "CSC 403",
    department: "Computer Science",
    creditUnits: 3,
    semesterOffered: "First",
    levels: ["400L"],
    description: "Machine learning, neural networks, and AI algorithms",
    icon: "Brain",
    resourceCount: { pastQuestions: 8, notes: 32, quizzes: 7 },
    createdBy: "admin001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "CSC404",
    title: "Database Systems",
    code: "CSC 404",
    department: "Computer Science",
    creditUnits: 3,
    semesterOffered: "Second",
    levels: ["400L"],
    description: "Database design, SQL, and data management systems",
    icon: "HardDrive",
    resourceCount: { pastQuestions: 9, notes: 26, quizzes: 6 },
    createdBy: "admin001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "CSC405",
    title: "Cybersecurity",
    code: "CSC 405",
    department: "Computer Science",
    creditUnits: 3,
    semesterOffered: "Second",
    levels: ["400L"],
    description: "Security principles, cryptography, and secure systems design",
    icon: "Shield",
    resourceCount: { pastQuestions: 7, notes: 20, quizzes: 4 },
    createdBy: "admin001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "CSC499",
    title: "Capstone Project",
    code: "CSC 499",
    department: "Computer Science",
    creditUnits: 6,
    semesterOffered: "Both",
    levels: ["400L"],
    description: "Final year project demonstrating comprehensive software development skills",
    icon: "Briefcase",
    resourceCount: { pastQuestions: 5, notes: 15, quizzes: 2 },
    createdBy: "admin001",
    createdAt: "2024-01-15T10:00:00Z",
  },
];

export const mockPastQuestions: PastQuestion[] = [
  {
    _id: "pq001",
    courseId: "CSC401",
    year: 2024,
    semester: "First",
    type: "exam",
    fileURL: "#",
    fileName: "CSC401_2024_First_Semester_Exam.pdf",
    uploadedBy: "user002",
    fileSize: 2048000,
    fileType: "application/pdf",
    downloadCount: 156,
    createdAt: "2024-06-15T10:00:00Z",
  },
  {
    _id: "pq002",
    courseId: "CSC401",
    year: 2023,
    semester: "First",
    type: "exam",
    fileURL: "#",
    fileName: "CSC401_2023_First_Semester_Exam.pdf",
    uploadedBy: "user002",
    fileSize: 1856000,
    fileType: "application/pdf",
    downloadCount: 234,
    createdAt: "2023-06-20T10:00:00Z",
  },
  {
    _id: "pq003",
    courseId: "CSC401",
    year: 2024,
    semester: "First",
    type: "mid-semester",
    fileURL: "#",
    fileName: "CSC401_2024_First_Semester_MidSemester.pdf",
    uploadedBy: "user002",
    fileSize: 1200000,
    fileType: "application/pdf",
    downloadCount: 98,
    createdAt: "2024-03-18T10:00:00Z",
  },
  {
    _id: "pq004",
    courseId: "CSC402",
    year: 2024,
    semester: "First",
    type: "exam",
    fileURL: "#",
    fileName: "CSC402_2024_First_Semester_Exam.pdf",
    uploadedBy: "user002",
    fileSize: 3200000,
    fileType: "application/pdf",
    downloadCount: 189,
    createdAt: "2024-06-18T10:00:00Z",
  },
  {
    _id: "pq005",
    courseId: "CSC402",
    year: 2024,
    semester: "First",
    type: "assignment",
    fileURL: "#",
    fileName: "CSC402_2024_First_Semester_Assignment1.pdf",
    uploadedBy: "user002",
    fileSize: 800000,
    fileType: "application/pdf",
    downloadCount: 145,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    _id: "pq006",
    courseId: "CSC403",
    year: 2024,
    semester: "First",
    type: "quiz",
    fileURL: "#",
    fileName: "CSC403_2024_First_Semester_Quiz1.pdf",
    uploadedBy: "admin001",
    fileSize: 600000,
    fileType: "application/pdf",
    downloadCount: 167,
    createdAt: "2024-04-10T10:00:00Z",
  },
  {
    _id: "pq007",
    courseId: "CSC404",
    year: 2024,
    semester: "Second",
    type: "project",
    fileURL: "#",
    fileName: "CSC404_2024_Second_Semester_Project.pdf",
    uploadedBy: "admin001",
    fileSize: 2500000,
    fileType: "application/pdf",
    downloadCount: 312,
    createdAt: "2024-06-10T10:00:00Z",
  },
  {
    _id: "pq008",
    courseId: "CSC405",
    year: 2024,
    semester: "First",
    type: "class-work",
    fileURL: "#",
    fileName: "CSC405_2024_First_Semester_ClassWork.pdf",
    uploadedBy: "user002",
    fileSize: 450000,
    fileType: "application/pdf",
    downloadCount: 89,
    createdAt: "2024-05-10T10:00:00Z",
  },
];

export const mockCommunityNotes: CommunityNote[] = [
  {
    _id: "note001",
    authorId: "user002",
    courseId: "CSC401",
    title: "Complete Guide to Recursion",
    content: `<h2>Understanding Recursion</h2>
<p>Recursion is a programming technique where a function calls itself to solve a problem. It's like breaking down a big problem into smaller, similar problems.</p>
<h3>Key Concepts</h3>
<ul>
<li><strong>Base Case:</strong> The condition that stops the recursion</li>
<li><strong>Recursive Case:</strong> The part where the function calls itself</li>
</ul>
<h3>Example: Factorial</h3>
<pre><code>function factorial(n) {
  if (n <= 1) return 1; // Base case
  return n * factorial(n - 1); // Recursive case
}</code></pre>
<p>This is one of the most important concepts in CS!</p>`,
    upvotes: 45,
    downvotes: 2,
    saves: 28,
    commentCount: 12,
    isPinned: true,
    score: 116,
    tags: ["recursion", "algorithms", "fundamentals"],
    createdAt: "2024-09-15T14:30:00Z",
    updatedAt: "2024-09-20T10:00:00Z",
  },
  {
    _id: "note002",
    authorId: "user003",
    courseId: "CSC401",
    title: "Binary Search Explained Simply",
    content: `<h2>Binary Search Algorithm</h2>
<p>Binary search is an efficient algorithm for finding an item in a <strong>sorted</strong> list.</p>
<h3>How It Works</h3>
<ol>
<li>Start with the middle element</li>
<li>If it matches, we're done!</li>
<li>If target is smaller, search the left half</li>
<li>If target is larger, search the right half</li>
<li>Repeat until found or exhausted</li>
</ol>
<h3>Time Complexity: O(log n)</h3>
<p>Much faster than linear search for large datasets!</p>`,
    upvotes: 32,
    downvotes: 1,
    saves: 19,
    commentCount: 8,
    isPinned: false,
    score: 78,
    tags: ["binary-search", "algorithms", "searching"],
    createdAt: "2024-09-18T16:45:00Z",
    updatedAt: "2024-09-18T16:45:00Z",
  },
  {
    _id: "note003",
    authorId: "user002",
    courseId: "CSC402",
    title: "Linked Lists vs Arrays - When to Use What",
    content: `<h2>Choosing Between Linked Lists and Arrays</h2>
<h3>Use Arrays When:</h3>
<ul>
<li>You need fast random access (O(1))</li>
<li>Size is known and fixed</li>
<li>Memory locality matters</li>
</ul>
<h3>Use Linked Lists When:</h3>
<ul>
<li>Frequent insertions/deletions</li>
<li>Size is dynamic</li>
<li>No need for random access</li>
</ul>`,
    upvotes: 28,
    downvotes: 0,
    saves: 15,
    commentCount: 5,
    isPinned: true,
    score: 71,
    tags: ["data-structures", "arrays", "linked-lists"],
    createdAt: "2024-09-20T11:00:00Z",
    updatedAt: "2024-09-20T11:00:00Z",
  },
  {
    _id: "note004",
    authorId: "user001",
    courseId: "CSC403",
    title: "Calculus Cheat Sheet - Derivatives",
    content: `<h2>Quick Reference: Derivatives</h2>
<h3>Basic Rules</h3>
<ul>
<li>Power Rule: d/dx(x^n) = nx^(n-1)</li>
<li>Sum Rule: d/dx(f+g) = f' + g'</li>
<li>Product Rule: d/dx(fg) = f'g + fg'</li>
<li>Chain Rule: d/dx(f(g(x))) = f'(g(x)) × g'(x)</li>
</ul>`,
    upvotes: 56,
    downvotes: 3,
    saves: 42,
    commentCount: 15,
    isPinned: true,
    score: 150,
    tags: ["calculus", "derivatives", "cheat-sheet"],
    createdAt: "2024-09-10T09:00:00Z",
    updatedAt: "2024-09-12T14:00:00Z",
  },
];

export const mockComments: Comment[] = [
  {
    _id: "comment001",
    noteId: "note001",
    userId: "user003",
    userName: "Mike Brown",
    userAvatar: "User",
    content: "This helped me finally understand recursion! Thanks Sarah!",
    createdAt: "2024-09-16T10:00:00Z",
  },
  {
    _id: "comment002",
    noteId: "note001",
    userId: "user001",
    userName: "Alex Johnson",
    userAvatar: "User",
    content: "Could you add an example with tree traversal?",
    createdAt: "2024-09-17T14:30:00Z",
  },
  {
    _id: "comment003",
    noteId: "note002",
    userId: "user002",
    userName: "Sarah Chen",
    userAvatar: "UserCircle",
    content: "Great explanation! Very clear and concise.",
    createdAt: "2024-09-19T11:00:00Z",
  },
];

export const mockQuizzes: Quiz[] = [
  {
    _id: "quiz001",
    courseId: "CSC401",
    title: "Recursion Fundamentals",
    description: "Test your understanding of recursive algorithms and base cases",
    questions: [
      {
        _id: "q001",
        questionText: "What is the base case in recursion?",
        options: [
          "The first call to the function",
          "The condition that stops the recursion",
          "The recursive call itself",
          "The return statement"
        ],
        correctOptionIndex: 1,
        explanation: "The base case is the condition that stops the recursion, preventing infinite loops."
      },
      {
        _id: "q002",
        questionText: "What happens without a base case?",
        options: [
          "The function runs faster",
          "Stack overflow error",
          "Nothing special",
          "The function returns undefined"
        ],
        correctOptionIndex: 1,
        explanation: "Without a base case, the function keeps calling itself indefinitely, causing a stack overflow."
      },
      {
        _id: "q003",
        questionText: "What is the time complexity of a simple recursive factorial?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctOptionIndex: 2,
        explanation: "Factorial makes n recursive calls, each doing O(1) work, so total is O(n)."
      },
    ],
    timeLimitMins: 5,
    attemptCount: 89,
    avgScore: 76,
    createdBy: "user002",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "quiz002",
    courseId: "CSC401",
    title: "Binary Search Mastery",
    description: "Challenge yourself on binary search concepts and implementation",
    questions: [
      {
        _id: "q004",
        questionText: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctOptionIndex: 1,
        explanation: "Binary search halves the search space each step, giving O(log n) complexity."
      },
      {
        _id: "q005",
        questionText: "Binary search requires the array to be:",
        options: ["Empty", "Sorted", "Of even length", "Containing unique elements"],
        correctOptionIndex: 1,
        explanation: "Binary search only works on sorted arrays because it relies on the ordering to eliminate half the elements."
      },
    ],
    timeLimitMins: 3,
    attemptCount: 67,
    avgScore: 82,
    createdBy: "user002",
    createdAt: "2024-09-05T10:00:00Z",
  },
  {
    _id: "quiz003",
    courseId: "CSC402",
    title: "Data Structures Deep Dive",
    description: "Comprehensive quiz on arrays, linked lists, stacks, and queues",
    questions: [
      {
        _id: "q006",
        questionText: "What is the time complexity of inserting at the beginning of an array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctOptionIndex: 2,
        explanation: "Inserting at the beginning requires shifting all existing elements, which is O(n)."
      },
      {
        _id: "q007",
        questionText: "Which data structure uses LIFO ordering?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctOptionIndex: 1,
        explanation: "Stack uses Last-In-First-Out (LIFO) ordering - the last element added is the first removed."
      },
    ],
    timeLimitMins: 10,
    attemptCount: 54,
    avgScore: 71,
    createdBy: "admin001",
    createdAt: "2024-09-10T10:00:00Z",
  },
];

export const mockRequests: Request[] = [
  {
    _id: "req001",
    userId: "user001",
    userName: "Alex Johnson",
    courseId: "CSC401",
    courseName: "Introduction to Computer Science",
    type: "pq",
    message: "Please upload CSC401 2022 First Semester past questions",
    status: "pending",
    createdAt: "2024-11-28T14:00:00Z",
  },
  {
    _id: "req002",
    userId: "user003",
    userName: "Mike Brown",
    courseId: "CSC402",
    courseName: "Data Structures and Algorithms",
    type: "notes",
    message: "Need notes on AVL trees and balancing",
    status: "resolved",
    resolvedBy: "user002",
    createdAt: "2024-11-25T10:00:00Z",
  },
  {
    _id: "req003",
    userId: "user001",
    userName: "Alex Johnson",
    courseId: "CSC403",
    courseName: "Elementary Mathematics I",
    type: "quiz",
    message: "Can we get more practice quizzes on integration?",
    status: "pending",
    createdAt: "2024-11-30T09:00:00Z",
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "user002", userName: "Sarah Chen", userAvatar: "UserCircle", reputationScore: 342, noteCount: 15, quizAvgScore: 94 },
  { rank: 2, userId: "user001", userName: "Alex Johnson", userAvatar: "User", reputationScore: 156, noteCount: 8, quizAvgScore: 88 },
  { rank: 3, userId: "user003", userName: "Mike Brown", userAvatar: "User", reputationScore: 89, noteCount: 4, quizAvgScore: 76 },
  { rank: 4, userId: "user004", userName: "Emma Davis", userAvatar: "User", reputationScore: 78, noteCount: 3, quizAvgScore: 82 },
  { rank: 5, userId: "user005", userName: "James Wilson", userAvatar: "User", reputationScore: 65, noteCount: 2, quizAvgScore: 79 },
];

// ============ MOCK API ============

let levels = [...mockLevels];
let courses = [...mockCourses];
let pastQuestions = [...mockPastQuestions];
let communityNotes = [...mockCommunityNotes];
let comments = [...mockComments];
let quizzes = [...mockQuizzes];
let requests = [...mockRequests];
let currentUser = { ...mockCurrentUser };

export const studyHiveApi = {
  // Auth
  auth: {
    getCurrentUser: () => currentUser,
    login: (email: string, password: string) => {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        currentUser = user;
        return user;
      }
      throw new Error("Invalid credentials");
    },
    signup: (name: string, email: string, password: string) => {
      // Check if user already exists
      if (mockUsers.find(u => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      const newUser: User = {
        _id: `user${Date.now()}`,
        name,
        email,
        role: "student",
        isVerified: false,
        reputationScore: 0,
        savedNotes: [],
        assignedCourses: [],
        avatar: "User",
        createdAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      currentUser = newUser;
      return newUser;
    },
    logout: () => {
      currentUser = mockCurrentUser;
    },
  },

  // Levels
  levels: {
    getAll: () => levels,
    getById: (id: string) => levels.find(l => l._id === id),
    getCourses: (levelId: string) => {
      const level = levels.find(l => l._id === levelId);
      if (!level) return [];
      return courses.filter(c => level.courses.includes(c._id));
    },
  },

  // Courses
  courses: {
    getAll: () => courses,
    getById: (id: string) => courses.find(c => c._id === id),
    getByLevel: (levelId: string) => {
      const level = levels.find(l => l._id === levelId);
      if (!level) return [];
      return courses.filter(c => level.courses.includes(c._id));
    },
    search: (query: string) => {
      const q = query.toLowerCase();
      return courses.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    },
  },

  // Past Questions
  pastQuestions: {
    getByCourse: (courseId: string) => pastQuestions.filter(pq => pq.courseId === courseId),
    getById: (id: string) => pastQuestions.find(pq => pq._id === id),
    download: (id: string) => {
      const pq = pastQuestions.find(p => p._id === id);
      if (pq) pq.downloadCount++;
      return pq;
    },
  },

  // Community Notes
  notes: {
    getByCourse: (courseId: string) => 
      communityNotes
        .filter(n => n.courseId === courseId)
        .sort((a, b) => b.score - a.score),
    getById: (id: string) => communityNotes.find(n => n._id === id),
    getPinned: (courseId: string) => 
      communityNotes.filter(n => n.courseId === courseId && n.isPinned),
    getSaved: () => 
      communityNotes.filter(n => currentUser.savedNotes.includes(n._id) && !n.isArchived),
    create: (note: Partial<CommunityNote>) => {
      const newNote: CommunityNote = {
        _id: `note${Date.now()}`,
        authorId: currentUser._id,
        courseId: note.courseId || "",
        title: note.title || "Untitled",
        content: note.content || JSON.stringify([{
          type: "paragraph",
          content: "Start writing..."
        }]),
        upvotes: 0,
        downvotes: 0,
        saves: 0,
        commentCount: 0,
        isPinned: false,
        score: 0,
        tags: note.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      communityNotes.push(newNote);
      return newNote;
    },
    update: (id: string, updates: Partial<CommunityNote>) => {
      const index = communityNotes.findIndex(n => n._id === id);
      if (index !== -1) {
        communityNotes[index] = { 
          ...communityNotes[index], 
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return communityNotes[index];
      }
      return null;
    },
    upvote: (id: string) => {
      const note = communityNotes.find(n => n._id === id);
      if (note) {
        note.upvotes++;
        note.score = (note.upvotes * 2) + note.saves + note.commentCount - note.downvotes;
      }
      return note;
    },
    downvote: (id: string) => {
      const note = communityNotes.find(n => n._id === id);
      if (note) {
        note.downvotes++;
        note.score = (note.upvotes * 2) + note.saves + note.commentCount - note.downvotes;
      }
      return note;
    },
    save: (id: string) => {
      const note = communityNotes.find(n => n._id === id);
      if (note && !currentUser.savedNotes.includes(id)) {
        currentUser.savedNotes.push(id);
        note.saves++;
        note.score = (note.upvotes * 2) + note.saves + note.commentCount - note.downvotes;
      }
      return note;
    },
    unsave: (id: string) => {
      currentUser.savedNotes = currentUser.savedNotes.filter(nid => nid !== id);
      const note = communityNotes.find(n => n._id === id);
      if (note && note.saves > 0) {
        note.saves--;
        note.score = (note.upvotes * 2) + note.saves + note.commentCount - note.downvotes;
      }
      return note;
    },
    removeIcon: (id: string) => {
      const note = communityNotes.find(n => n._id === id);
      if (note) {
        note.icon = undefined;
      }
      return note;
    },
    removeCoverImage: (id: string) => {
      const note = communityNotes.find(n => n._id === id);
      if (note) {
        note.coverImage = undefined;
      }
      return note;
    },
    archive: (id: string) => {
      const note = communityNotes.find(n => n._id === id);
      if (note) {
        note.isArchived = true;
        note.updatedAt = new Date().toISOString();
      }
      return note;
    },
    restore: (id: string) => {
      const note = communityNotes.find(n => n._id === id);
      if (note) {
        note.isArchived = false;
        note.updatedAt = new Date().toISOString();
      }
      return note;
    },
    remove: (id: string) => {
      const index = communityNotes.findIndex(n => n._id === id);
      if (index !== -1) {
        communityNotes.splice(index, 1);
        return true;
      }
      return false;
    },
    getArchived: () => communityNotes.filter(n => n.isArchived),
  },

  // Comments
  comments: {
    getByNote: (noteId: string) => comments.filter(c => c.noteId === noteId),
    create: (noteId: string, content: string) => {
      const newComment: Comment = {
        _id: `comment${Date.now()}`,
        noteId,
        userId: currentUser._id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content,
        createdAt: new Date().toISOString(),
      };
      comments.push(newComment);
      const note = communityNotes.find(n => n._id === noteId);
      if (note) note.commentCount++;
      return newComment;
    },
  },

  // Quizzes
  quizzes: {
    getByCourse: (courseId: string) => quizzes.filter(q => q.courseId === courseId),
    getById: (id: string) => quizzes.find(q => q._id === id),
    submitAttempt: (quizId: string, answers: number[], timeTaken: number) => {
      const quiz = quizzes.find(q => q._id === quizId);
      if (!quiz) return null;
      
      let correct = 0;
      quiz.questions.forEach((q, i) => {
        if (answers[i] === q.correctOptionIndex) correct++;
      });
      
      const score = Math.round((correct / quiz.questions.length) * 100);
      quiz.attemptCount++;
      
      return {
        score,
        correct,
        total: quiz.questions.length,
        timeTaken,
      };
    },
  },

  // Requests
  requests: {
    getAll: () => requests,
    getPending: () => requests.filter(r => r.status === "pending"),
    create: (request: Partial<Request>) => {
      const course = courses.find(c => c._id === request.courseId);
      const newRequest: Request = {
        _id: `req${Date.now()}`,
        userId: currentUser._id,
        userName: currentUser.name,
        courseId: request.courseId || "",
        courseName: course?.title || "",
        type: request.type || "pq",
        message: request.message || "",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      requests.push(newRequest);
      return newRequest;
    },
    resolve: (id: string) => {
      const req = requests.find(r => r._id === id);
      if (req) {
        req.status = "resolved";
        req.resolvedBy = currentUser._id;
      }
      return req;
    },
  },

  // Leaderboard
  leaderboard: {
    getGlobal: () => mockLeaderboard,
    getByCourse: (courseId: string) => mockLeaderboard, // In real app, filter by course
  },

  // Search
  search: {
    global: (query: string) => {
      const q = query.toLowerCase();
      return {
        courses: courses.filter(c => 
          c.title.toLowerCase().includes(q) || 
          c.code.toLowerCase().includes(q)
        ),
        notes: communityNotes.filter(n => 
          n.title.toLowerCase().includes(q)
        ),
        quizzes: quizzes.filter(quiz => 
          quiz.title.toLowerCase().includes(q)
        ),
      };
    },
  },
};

