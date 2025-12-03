// Client-safe date formatting to prevent hydration mismatches
export const formatDate = (dateString: string): string => {
  if (typeof window === "undefined") {
    // Server-side: return a consistent format
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  // Client-side: can use locale-specific formatting
  return new Date(dateString).toLocaleDateString();
};

