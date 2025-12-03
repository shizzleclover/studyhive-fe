# StudyHive 🐝

**"Where Students Thrive Together"**

A clean, community-driven academic platform for students to access past questions, quizzes, notes, and collaborate with peers to study effectively.

![StudyHive](https://img.shields.io/badge/Next.js-13-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

### 📚 Academic Resources
- **Past Questions Library** - Access years of past exam questions organized by course and semester
- **Community Notes** - Rich-text notes with voting, saving, and commenting
- **Interactive Quizzes** - Timed quizzes with instant feedback and explanations

### 🎯 Navigation & Organization
- **Level-based Hierarchy** - 100L → 200L → 300L → 400L
- **Course Organization** - Browse courses by department and credit units
- **Smart Search** - Global search with keyboard shortcut (⌘K)

### 👥 Community Features
- **Voting System** - Upvote/downvote notes to surface quality content
- **Comments** - Discuss and clarify concepts with peers
- **Leaderboard** - Compete for top contributor status
- **Request System** - Request missing study materials

### 🎨 UI/UX
- **Notion-like Interface** - Clean, minimalistic design
- **Dark Mode Support** - Easy on the eyes during late-night study sessions
- **Responsive Design** - Works on desktop and mobile
- **Resizable Sidebar** - Customize your workspace

## 🚀 Getting Started

### Prerequisites
- Node.js 16.8 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd notion-clone-nextjs
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── (main)/                    # Main application
│   │   └── (routes)/
│   │       ├── levels/            # Levels browsing
│   │       ├── courses/[courseId] # Course details with resources
│   │       ├── notes/[noteId]     # Note viewer with comments
│   │       ├── quizzes/[quizId]   # Interactive quiz
│   │       ├── leaderboard/       # Rankings
│   │       ├── requests/          # Resource requests
│   │       └── saved/             # Saved notes
│   ├── (marketing)/               # Landing page
│   └── (public)/                  # Public preview pages
├── components/
│   ├── modals/                    # Modal dialogs
│   ├── providers/                 # Context providers
│   └── ui/                        # shadcn/ui components
├── hooks/                         # Custom React hooks
└── lib/
    ├── studyhive-data.ts          # Mock data & API
    └── utils.ts                   # Helper functions
```

## 🎨 Design System

### Colors
- **Primary**: Amber/Orange gradient (`#f59e0b` → `#ea580c`)
- **Background**: `#f7f7f7` (light) / `#1F1F1F` (dark)
- **Cards**: `#ffffff` (light) / dark variants
- **Accent Colors**: 
  - Blue for quizzes
  - Green for success states
  - Purple for special features

### Typography
- **Font**: Inter (via Next.js font optimization)
- **Headings**: Bold, clear hierarchy
- **Body**: Clean, readable text

### Components
Built on [shadcn/ui](https://ui.shadcn.com/) with custom styling:
- Buttons with amber accent
- Cards with hover effects
- Dialog modals
- Dropdown menus
- Command palette (search)

## 🔧 Data Structure

### User Roles
| Role | Permissions |
|------|-------------|
| **Student** | Browse, download, create notes, vote, comment, save |
| **Rep** | Upload PQs, create quizzes, moderate notes |
| **Admin** | Full access, manage users, platform analytics |

### Core Entities
- **Levels** → Contains courses
- **Courses** → Contains resources (PQs, Notes, Quizzes)
- **Community Notes** → Rich text with voting/comments
- **Quizzes** → Timed MCQ assessments
- **Requests** → Student requests for materials

### Reputation System
```
reputation = (noteUpvotes × 2) + saves + quizScores + comments - downvotes
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 13 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State | Zustand |
| Notifications | Sonner |
| Icons | Lucide React |

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔌 Adding a Real Backend

This project uses mock data in `lib/studyhive-data.ts`. To connect a real backend:

1. **Replace mock API** with actual API calls
2. **Set up MongoDB** for data persistence
3. **Configure Cloudflare R2** for file storage
4. **Add JWT authentication** for user sessions
5. **Implement real-time updates** with WebSockets (optional)

### Recommended Backend Stack
- **Database**: MongoDB Atlas
- **File Storage**: Cloudflare R2
- **Auth**: JWT with access/refresh tokens
- **API**: Next.js API routes or Express.js

## 🚧 Demo Limitations

- Data resets on page refresh (in-memory storage)
- File uploads use data URLs (not suitable for large files)
- No real authentication
- No real-time updates
- No data persistence

## 📄 API Endpoints (Future Backend)

```
POST /auth/signup
POST /auth/login
POST /auth/refresh

GET  /levels
GET  /levels/:id/courses
GET  /courses/:id

GET  /pq/:courseId
POST /pq

GET  /notes/:courseId
POST /notes
POST /notes/:id/upvote
POST /notes/:id/save

GET  /quiz/:courseId
POST /quiz/attempt

POST /requests
GET  /requests

GET  /leaderboard
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is open source and available for learning and building your own projects.

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**StudyHive** - Where students thrive together 🐝
