"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
    const { user } = useAuth();
    const router = useRouter();

    // Handle missing user data gracefully
    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 p-6">
                <Image
                    src="/empty.png"
                    height="300"
                    width="300"
                    alt="Empty"
                    className="dark:hidden"
                />
                <Image
                    src="/empty-dark.png"
                    height="300"
                    width="300"
                    alt="Empty"
                    className="hidden dark:block"
                />
                <h2 className="text-lg font-medium">
                    Welcome to StudyHive
                </h2>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                    We're having trouble loading your profile. Don't worry - your account is active!
                </p>
                <div className="flex gap-3">
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Refresh Page
                    </Button>
                    <Button onClick={() => router.push("/documents")}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Continue to App
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/empty.png"
                height="300"
                width="300"
                alt="Empty"
                className="dark:hidden"
            />
            <Image
                src="/empty-dark.png"
                height="300"
                width="300"
                alt="Empty"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to your dashboard, {user.name}
            </h2>
            <Button onClick={() => router.push("/documents")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create a note
            </Button>
        </div>
    );
}

export default DashboardPage;
