"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Trophy,
  RotateCcw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { quizzesService } from "@/lib/api/services/quizzes.service";

interface QuizPageProps {
  params: {
    quizId: string;
  };
}

type QuizState = "intro" | "active" | "results";

const QuizPage = ({ params }: QuizPageProps) => {
  const router = useRouter();
  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", params.quizId],
    queryFn: () => quizzesService.getQuizById(params.quizId, true),
  });
  const course = quiz && typeof quiz.courseId !== "string" ? quiz.courseId : null;

  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<{ score: number; correct: number; total: number } | null>(null);

  useEffect(() => {
    if (quizState === "active" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, timeLeft]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Loading quiz...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Quiz not found</h2>
          <Button className="mt-4" onClick={() => router.push("/levels")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const startQuiz = () => {
    setQuizState("active");
    setTimeLeft(quiz.timeLimitMins * 60);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
  };

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const result = await quizzesService.submitQuizAttempt(quiz._id, {
        answers: selectedAnswers,
        timeSpent: (quiz.timeLimitMins * 60) - timeLeft,
      });
      setResults({
        score: result.score,
        correct: result.correct,
        total: result.total,
      });
    } catch (error) {
      // silently fail
    } finally {
      setQuizState("results");
    }
  };

  const restartQuiz = () => {
    setQuizState("intro");
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setResults(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Intro Screen
  if (quizState === "intro") {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Button variant="ghost" size="sm" onClick={() => router.push("/levels")} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="bg-background border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🧠</span>
            </div>

            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-muted-foreground mb-6">{quiz.description}</p>

            {course && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm mb-6">
                <span>{course.icon}</span>
                <span>{course.code}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 py-6 border-y mb-6">
              <div>
                <div className="text-2xl font-bold text-purple-500">{quiz.questions.length}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">{quiz.timeLimitMins}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">{quiz.avgScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
            </div>

            <Button 
              onClick={startQuiz} 
              size="lg" 
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz
  if (quizState === "active") {
    const question = quiz.questions[currentQuestion];

    return (
      <div className="h-full flex flex-col">
        {/* Quiz Header */}
      <div className="bg-background sticky top-0 z-10">
          <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
              timeLeft < 60 ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-muted"
            )}>
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">{question.questionText}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={cn(
                    "w-full p-4 text-left rounded-xl border-2 transition-all",
                    selectedAnswers[currentQuestion] === index
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-muted hover:border-purple-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      selectedAnswers[currentQuestion] === index
                        ? "bg-purple-500 text-white"
                        : "bg-muted"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t bg-background p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < quiz.questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={selectedAnswers[currentQuestion] === -1}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600"
                disabled={selectedAnswers.includes(-1)}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-background border rounded-2xl p-8 text-center">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
            results && results.score >= 70 
              ? "bg-green-100 dark:bg-green-900/30" 
              : "bg-amber-100 dark:bg-amber-900/30"
          )}>
            {results && results.score >= 70 ? (
              <Trophy className="h-10 w-10 text-green-500" />
            ) : (
              <span className="text-4xl">📚</span>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {results && results.score >= 70 ? "Great Job!" : "Keep Practicing!"}
          </h1>

          <div className="text-5xl font-bold text-purple-500 my-6">
            {results?.score}%
          </div>

          <p className="text-muted-foreground mb-6">
            You got {results?.correct} out of {results?.total} questions correct
          </p>

          {/* Answer Review */}
          <div className="space-y-2 mb-6 text-left">
            {quiz.questions.map((q, i) => (
              <div 
                key={q._id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-sm",
                  selectedAnswers[i] === q.correctOptionIndex
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-red-50 dark:bg-red-900/20"
                )}
              >
                {selectedAnswers[i] === q.correctOptionIndex ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
                <span className="truncate">Q{i + 1}: {q.questionText}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={restartQuiz} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => {
              if (course) {
                router.push(`/courses/${course._id}`);
              } else {
                router.push("/levels");
              }
            }} className="flex-1">
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

