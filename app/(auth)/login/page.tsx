"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        if (result.needsVerification) {
          toast.success("Please verify your email to continue");
          router.push("/verify-email");
        } else {
          toast.success("Welcome back!");
          router.push("/dashboard");
        }
      } else {
        toast.error(result.error || "Invalid email or password");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight transition-colors">Welcome back</h1>
          <p className="text-muted-foreground mt-2 transition-colors">
            Enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-transparent transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline transition-all duration-300 ease-in-out"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-transparent transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full transition-all duration-300 ease-in-out hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Link href="/signup" className="font-medium hover:underline transition-all duration-300 ease-in-out">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
