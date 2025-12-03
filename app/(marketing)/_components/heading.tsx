"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export const Heading = () => {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">StudyHive</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        StudyHive is the connected workspace where <br />
        better, faster learning happens.
      </h3>
      {isAuthenticated ? (
        <Button asChild>
          <Link href="/documents">
            Enter StudyHive <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href="/login">
            Log in to StudyHive <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
};
