"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle,
  FileText,
  BookOpen,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { requestsService } from "@/lib/api/services/requests.service";
import { useCourses } from "@/hooks/use-courses";
import { RequestType } from "@/lib/api/types";

const RequestsPage = () => {
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    courseId: "",
    type: "pq" as "pq" | "notes" | "quiz",
    message: "",
  });
  const { data: courses } = useCourses();
  const { data: requestsResponse, refetch, isLoading } = useQuery({
    queryKey: ["requests", filter],
    queryFn: () => requestsService.getRequests({ status: filter === "all" ? undefined : filter, limit: 50, page: 1 }),
  });

  const requests = requestsResponse?.data ?? [];

  const filteredRequests = requests.filter(req => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "dismissed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pq":
        return <FileText className="h-4 w-4" />;
      case "notes":
        return <BookOpen className="h-4 w-4" />;
      case "quiz":
        return <Brain className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleSubmitRequest = async () => {
    if (!newRequest.courseId || !newRequest.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await requestsService.createRequest({
        courseId: newRequest.courseId,
        type: newRequest.type as RequestType,
        message: newRequest.message,
      });
      setNewRequest({ courseId: "", type: "pq", message: "" });
      setIsDialogOpen(false);
      toast.success("Request submitted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit request");
    }
  };

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Requests</h1>
            <p className="text-sm text-muted-foreground">
              Request missing study materials
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Course</label>
                  <select
                    value={newRequest.courseId}
                    onChange={(e) => setNewRequest({ ...newRequest, courseId: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="">Select a course</option>
                    {(courses ?? []).map((course) => (
                      <option key={course._id} value={course._id}>
                        {typeof course.level === "string" ? "" : course.level?.name} {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <div className="flex gap-2">
                    {[
                      { id: "pq", label: "Past Question", icon: FileText },
                      { id: "notes", label: "Notes", icon: BookOpen },
                      { id: "quiz", label: "Quiz", icon: Brain },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setNewRequest({ ...newRequest, type: type.id as any })}
                        className={cn(
                          "flex-1 p-3 border rounded-lg flex flex-col items-center gap-1 transition-colors",
                          newRequest.type === type.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "hover:border-blue-300"
                        )}
                      >
                        <type.icon className="h-5 w-5" />
                        <span className="text-xs">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Input
                    placeholder="e.g., Please upload 2022 First Semester past questions"
                    value={newRequest.message}
                    onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                  />
                </div>

                <Button onClick={handleSubmitRequest} className="w-full">
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors capitalize",
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">
              {filter === "all" 
                ? "You haven't made any requests yet" 
                : `No ${filter} requests`}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="group min-h-[50px] px-4 py-3 w-full hover:bg-primary/5 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getTypeIcon(request.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{request.courseName}</div>
                    <div className="text-xs text-muted-foreground truncate">{request.message}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {getStatusIcon(request.status)}
                    <span className="capitalize">{request.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;

