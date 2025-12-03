"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Clock, Timer, Coffee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Orb = dynamic(() => import("@/components/orb"), { ssr: false });

type TimerMode = "pomodoro" | "short-break" | "long-break" | "stopwatch";

const POMODORO_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

const TimerPage = () => {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [durations, setDurations] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play notification sound
  const playSound = () => {
    if (typeof window !== "undefined" && "Audio" in window) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format stopwatch time as HH:MM:SS
  const formatStopwatch = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get initial time based on mode
  const getInitialTime = (timerMode: TimerMode) => {
    switch (timerMode) {
      case "pomodoro":
        return durations.pomodoro * 60;
      case "short-break":
        return durations.shortBreak * 60;
      case "long-break":
        return durations.longBreak * 60;
      default:
        return 0;
    }
  };

  // Handle timer completion
  useEffect(() => {
    if (mode !== "stopwatch" && timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      playSound();
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000);

      if (mode === "pomodoro") {
        setPomodoroCount((prev) => prev + 1);
        toast.success("Pomodoro complete! 🎉 Take a break!");
        // Auto switch to break after pomodoro
        if (pomodoroCount % 3 === 2) {
          setMode("long-break");
          setTimeLeft(durations.longBreak * 60);
        } else {
          setMode("short-break");
          setTimeLeft(durations.shortBreak * 60);
        }
      } else {
        toast.success("Break complete! Ready for another pomodoro?");
        setMode("pomodoro");
        setTimeLeft(durations.pomodoro * 60);
      }
    }
  }, [timeLeft, isRunning, mode, pomodoroCount]);

  // Timer countdown
  useEffect(() => {
    if (mode === "stopwatch") return;

    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode]);

  // Stopwatch countup
  useEffect(() => {
    if (mode !== "stopwatch") return;

    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === "stopwatch") {
      setStopwatchTime(0);
    } else {
      setTimeLeft(getInitialTime(mode));
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === "stopwatch") {
      setStopwatchTime(0);
    } else {
      setTimeLeft(getInitialTime(newMode));
    }
  };

  const getProgress = () => {
    if (mode === "stopwatch") return 0;
    const initial = getInitialTime(mode);
    return ((initial - timeLeft) / initial) * 100;
  };

  const getModeLabel = () => {
    switch (mode) {
      case "pomodoro":
        return "Focus Time";
      case "short-break":
        return "Short Break";
      case "long-break":
        return "Long Break";
      case "stopwatch":
        return "Study Session";
      default:
        return "";
    }
  };

  const getCurrentMinutes = () => {
    switch (mode) {
      case "pomodoro":
        return durations.pomodoro;
      case "short-break":
        return durations.shortBreak;
      case "long-break":
        return durations.longBreak;
      default:
        return 0;
    }
  };

  const handleCustomMinutesChange = (value: string) => {
    const minutes = parseInt(value, 10);
    if (Number.isNaN(minutes) || minutes <= 0) return;

    setDurations((prev) => {
      const next = { ...prev };
      if (mode === "pomodoro") next.pomodoro = minutes;
      if (mode === "short-break") next.shortBreak = minutes;
      if (mode === "long-break") next.longBreak = minutes;
      return next;
    });

    // If timer is not running and we're not in stopwatch mode, update the current time
    if (!isRunning && mode !== "stopwatch") {
      setTimeLeft(minutes * 60);
    }
  };

  return (
    <div className="min-h-full px-4 py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Study Timer</h1>
          <p className="text-sm text-muted-foreground">
            Stay focused and track your study sessions
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <button
            onClick={() => handleModeChange("pomodoro")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "pomodoro"
                ? "bg-foreground text-background"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            <Timer className="h-4 w-4 inline mr-2" />
            Pomodoro
          </button>
          <button
            onClick={() => handleModeChange("short-break")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "short-break"
                ? "bg-foreground text-background"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            Short Break
          </button>
          <button
            onClick={() => handleModeChange("long-break")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "long-break"
                ? "bg-foreground text-background"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            Long Break
          </button>
          <button
            onClick={() => handleModeChange("stopwatch")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "stopwatch"
                ? "bg-foreground text-background"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            <Clock className="h-4 w-4 inline mr-2" />
            Stopwatch
          </button>
        </div>

        {/* Custom Time Input (for current mode) */}
        {mode !== "stopwatch" && (
          <div className="mb-6 flex items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground">Custom minutes</span>
            <Input
              type="number"
              min={1}
              max={180}
              value={getCurrentMinutes()}
              onChange={(e) => handleCustomMinutesChange(e.target.value)}
              className="w-20 h-8 text-center text-sm"
            />
          </div>
        )}

        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {/* Orb Timer */}
          {mode !== "stopwatch" && (
            <div
              className={cn(
                "relative w-64 h-64 mb-8 transition-transform duration-300",
                isPulsing && "scale-110"
              )}
            >
              <Orb
                hoverIntensity={0.5}
                rotateOnHover
                forceHoverState={false}
                hue={mode === "pomodoro" ? 0 : mode === "short-break" ? 140 : 220}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className={cn(
                      "text-5xl font-bold mb-2 transition-all",
                      timeLeft < 60 && "text-red-500 animate-pulse"
                    )}
                  >
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    {mode === "pomodoro" && <Zap className="h-4 w-4" />}
                    {mode === "short-break" && <Coffee className="h-4 w-4" />}
                    {mode === "long-break" && <Coffee className="h-4 w-4" />}
                    {getModeLabel()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stopwatch Display */}
          {mode === "stopwatch" && (
            <div className="mb-8">
              <div className="text-center">
                <div className={cn(
                  "text-6xl font-bold mb-2 transition-all",
                  isRunning && "text-amber-500"
                )}>
                  {formatStopwatch(stopwatchTime)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  {getModeLabel()}
                </div>
              </div>
            </div>
          )}

          {/* Pomodoro Count */}
          {mode === "pomodoro" && pomodoroCount > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 justify-center">
                {[...Array(Math.min(pomodoroCount, 4))].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
                {pomodoroCount > 4 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    +{pomodoroCount - 4}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                Completed: {pomodoroCount} pomodoro{pomodoroCount !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleStartPause}
              size="lg"
              className="h-12 px-8"
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-12 px-8"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Tips & Motivational Messages */}
          <div className="mt-12 max-w-md text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {mode === "pomodoro" && (
                  isRunning 
                    ? "Stay focused! You're doing great! 💪"
                    : "Ready to focus? Start the timer and dive in!"
                )}
                {mode === "short-break" && (
                  isRunning
                    ? "Relax and recharge. You deserve it! ☕"
                    : "Take a 5-minute break to refresh your mind"
                )}
                {mode === "long-break" && (
                  isRunning
                    ? "Enjoy your well-deserved break! 🎉"
                    : "Take a 15-minute break - you've earned it!"
                )}
                {mode === "stopwatch" && (
                  isRunning
                    ? "Keep going! Every minute counts! ⏱️"
                    : "Start tracking your study session time"
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          {mode !== "stopwatch" && (
            <div className="mt-6 flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (mode === "pomodoro") {
                    handleModeChange("short-break");
                  } else {
                    handleModeChange("pomodoro");
                  }
                }}
              >
                {mode === "pomodoro" ? "Skip to Break" : "Skip to Focus"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerPage;

