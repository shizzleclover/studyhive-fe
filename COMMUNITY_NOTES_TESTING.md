# Community Notes Integration - Testing Guide

## 🚀 How to Test

1. **Start your backend server** on `http://localhost:5000`
2. **Navigate to** `http://localhost:3000/notes-test`
3. You'll see a test page with all the integration features

## 📝 What You Can Test

### 1. **View All Notes**
- The page automatically fetches and displays all community notes
- Toggle between "Recent" and "Popular" sorting
- See pagination info

### 2. **Create a Note**
- Click "Create Note" button
- Fill in:
  - Course ID (get this from your backend/database)
  - Title
  - Content
- Submit the form
- Note will appear in the list automatically (React Query auto-refreshes)

### 3. **View Note Details**
Each note card shows:
- Title and content
- Author name
- Course code
- Upvotes/downvotes count
- Saves count
- Comment count
- Pin status (if pinned)

## 🔧 Available Hooks (Use in Any Component)

```typescript
// Fetch notes
const { data, isLoading } = useCommunityNotes({ page: 1, limit: 10, sortBy: 'recent' });

// Get single note
const { data: note } = useCommunityNote(noteId);

// Get notes by course
const { data } = useNotesByCourse(courseId);

// Get current user's notes
const { data } = useMyNotes();

// Create note
const createNote = useCreateNote();
createNote.mutate({ courseId, title, content });

// Update note
const updateNote = useUpdateNote();
updateNote.mutate({ id: noteId, data: { title: 'New Title' } });

// Delete note
const deleteNote = useDeleteNote();
deleteNote.mutate(noteId);

// Pin/Unpin (Rep/Admin only)
const togglePin = useTogglePin();
togglePin.mutate({ id: noteId, isPinned: true });

// Report note
const reportNote = useReportNote();
reportNote.mutate(noteId);

// Infinite scroll
const { data, fetchNextPage, hasNextPage } = useInfiniteCommunityNotes({ sortBy: 'recent' });
```

## 🧪 Testing Checklist

### Basic Features
- [ ] View list of notes
- [ ] Sort by recent/popular
- [ ] Create new note
- [ ] See pagination working
- [ ] View note details

### Advanced Features
- [ ] Update a note (add to your component)
- [ ] Delete a note (add to your component)
- [ ] Filter by course
- [ ] View user's notes
- [ ] Save/unsave notes (user hook)

### Admin/Rep Features
- [ ] Pin/unpin notes
- [ ] Report notes

## 🐛 Troubleshooting

**Notes not loading?**
- Check backend is running on `http://localhost:5000`
- Check console for errors
- Verify you're logged in (tokens exist)
- Check Network tab in DevTools

**Create failing?**
- Verify Course ID exists in your database
- Check if you're authenticated
- Look at error toast message

**401 Errors?**
- You need to login first
- Check if tokens are stored in localStorage
- Try logging out and back in

## 💡 Next Steps

Once tested, integrate the hooks into your actual UI:
- Replace the test page with your real design
- Add the hooks to existing components
- Customize the UI to match your theme
- Add more features (comments, votes, etc.)

## 📚 Example: Using in Your Notes Page

```tsx
"use client";

import { useCommunityNotes } from "@/hooks/use-community-notes";

export default function NotesPage() {
  const { data, isLoading } = useCommunityNotes({ sortBy: 'popular' });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data.map(note => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}
```

That's it! Everything is ready to use. 🎉
