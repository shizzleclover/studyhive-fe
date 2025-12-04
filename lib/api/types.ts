// API Response Types

export interface ApiResponse<T = any> {
    statusCode?: number;
    success: boolean;
    message?: string;
    data?: T;
    stack?: string;
}

export interface ApiError {
    success: false;
    message: string;
    stack?: string;
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Auth Types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'rep' | 'admin';
    isVerified: boolean;
    profilePicture?: string;
    bio?: string;
    reputationScore: number;
    notesCreated: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    verificationOTP?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface VerifyEmailRequest {
    otp: string;
}

export interface ResendVerificationRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    otp: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// User Types
export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    profilePicture?: string;
}

export interface UserStats {
    notesCreated: number;
    notesSaved: number;
    quizzesTaken: number;
    reputationScore: number;
    rank?: number;
}

export interface SavedNote {
    _id: string;
    noteId: string;
    userId: string;
    savedAt: string;
}

export interface UpdateRoleRequest {
    role: 'student' | 'rep' | 'admin';
}

export interface AssignCoursesRequest {
    courseIds: string[];
}

export interface UpdateReputationRequest {
    score: number;
    reason?: string;
}

// Community Notes Types
export interface Course {
    _id: string;
    title: string;
    code: string;
    description: string;
    level: string | Level; // Can be populated
    department: string;
    creditUnits: number;
    semester: string;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateCourseRequest {
    title: string;
    code: string;
    description: string;
    level: string;
    department: string;
    creditUnits: number;
    semester: string;
}

export interface UpdateCourseRequest {
    title?: string;
    code?: string;
    description?: string;
    level?: string;
    department?: string;
    creditUnits?: number;
    semester?: string;
    isActive?: boolean;
}

export interface CoursesParams {
    levelId?: string;
    semester?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface CommunityNote {
    _id: string;
    authorId: User;
    courseId: Course;
    title: string;
    content: string;
    upvotes: number;
    downvotes: number;
    saves: number;
    commentCount: number;
    isPinned: boolean;
    score: number;
    tags?: string[];
    coverImage?: string;
    icon?: string;
    isArchived?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommunityNotesParams {
    page?: number;
    limit?: number;
    sortBy?: 'recent' | 'popular';
    courseId?: string;
    status?: 'active' | 'archived' | 'all';
}

export interface NotePagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface CommunityNotesResponse {
    data: CommunityNote[];
    pagination: NotePagination;
}

export interface CreateNoteRequest {
    courseId: string;
    title: string;
    content: string;
}

export interface UpdateNoteRequest {
    title?: string;
    content?: string;
    tags?: string[];
    coverImage?: string;
    icon?: string;
    isArchived?: boolean;
}

export interface PinNoteRequest {
    isPinned: boolean;
}

// Past Questions
export type PastQuestionType =
    | 'exam'
    | 'mid-semester'
    | 'quiz'
    | 'assignment'
    | 'class-work'
    | 'group-project'
    | 'project'
    | 'tutorial';

export interface PastQuestion {
    _id: string;
    courseId: Course | string;
    title: string;
    description?: string;
    year: number;
    semester: 'First' | 'Second';
    type: PastQuestionType;
    fileUrl: string;
    fileKey?: string;
    fileName: string;
    fileSize?: number;
    fileType?: string;
    downloadCount: number;
    createdBy: User | string;
    createdAt: string;
    updatedAt?: string;
}

export interface PastQuestionFilters extends PaginationParams {
    courseId?: string;
    year?: number;
    semester?: 'First' | 'Second';
    type?: PastQuestionType;
}

// Requests
export type RequestStatus = 'pending' | 'fulfilled' | 'rejected';
export type RequestType = 'pq' | 'notes' | 'quiz' | 'assignment';

export interface StudyRequest {
    _id: string;
    userId: User | string;
    courseId: Course | string;
    course?: Course;
    type: RequestType;
    message: string;
    status: RequestStatus;
    resolvedBy?: User | string;
    specificDetails?: Record<string, any>;
    votes?: number;
    createdAt: string;
    updatedAt: string;
}

export interface RequestFilters extends PaginationParams {
    courseId?: string;
    type?: RequestType;
    status?: RequestStatus;
}

export interface CreateRequestPayload {
    courseId: string;
    type: RequestType;
    message: string;
    specificDetails?: Record<string, any>;
}

// Comments
export interface Comment {
    _id: string;
    parentId: string;
    parentType: 'CommunityNote' | 'Request' | 'Quiz';
    author: User;
    content: string;
    createdAt: string;
    updatedAt: string;
    votes?: number;
}

export interface CreateCommentPayload {
    parentId: string;
    parentType: 'CommunityNote' | 'Request' | 'Quiz';
    content: string;
}

export interface UpdateCommentPayload {
    content: string;
}

// Votes
export type VoteTargetType = 'CommunityNote' | 'Comment' | 'Request';
export type VoteType = 'upvote' | 'downvote' | 'neutral';

export interface VotePayload {
    targetId: string;
    targetType: VoteTargetType;
    voteType: VoteType;
}

// Quizzes
export interface QuizQuestion {
    _id: string;
    questionText: string;
    options: string[];
    correctOptionIndex: number;
    explanation?: string;
    points?: number;
}

export interface Quiz {
    _id: string;
    courseId: Course | string;
    title: string;
    description?: string;
    questions: QuizQuestion[];
    timeLimitMins: number;
    maxAttempts?: number;
    attemptCount?: number;
    avgScore?: number;
    isPublished?: boolean;
    createdBy: User | string;
    createdAt: string;
    updatedAt?: string;
}

export interface QuizAttemptRequest {
    answers: number[];
    timeSpent: number;
}

export interface QuizAttemptResult {
    score: number;
    correct: number;
    total: number;
    timeTaken: number;
    passed?: boolean;
    explanation?: string;
}

export interface QuizFilters extends PaginationParams {
    courseId?: string;
    difficulty?: string;
    isPublished?: boolean;
}

// Leaderboard
export interface LeaderboardEntry {
    _id: string;
    user: User;
    rank: number;
    reputationScore: number;
    notesCreated: number;
    requestsFulfilled?: number;
    quizAverage?: number;
    role?: User['role'];
}

export interface LeaderboardFilters extends PaginationParams {
    role?: User['role'];
    scope?: 'global' | 'course';
    courseId?: string;
    window?: 'weekly' | 'monthly' | 'all-time';
}

// Search
export interface GlobalSearchResult {
    courses: Course[];
    notes: CommunityNote[];
    quizzes: Quiz[];
    pastQuestions: PastQuestion[];
    users: User[];
}

export interface SearchParams extends PaginationParams {
    q: string;
    type?: 'courses' | 'community-notes' | 'past-questions' | 'users';
}

// Academic Structure Types
export interface Level {
    _id: string;
    name: string;
    description?: string;
    department?: string;
    faculty?: string;
    order?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLevelRequest {
    name: string;
    description?: string;
    department?: string;
    faculty?: string;
    order?: number;
}

export interface UpdateLevelRequest {
    name?: string;
    description?: string;
    department?: string;
    faculty?: string;
    order?: number;
    isActive?: boolean;
}
