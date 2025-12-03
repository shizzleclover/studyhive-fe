"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const VerifyEmailPage = () => {
    const router = useRouter();
    const { verifyEmail, resendVerification, verificationEmail, needsVerification } = useAuth();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (!needsVerification) {
            router.push("/dashboard");
        }
    }, [needsVerification, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await verifyEmail(otp);

            if (result.success) {
                toast.success("Email verified successfully!");
                router.push("/dashboard");
            } else {
                toast.error(result.error || "Invalid or expired OTP");
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!verificationEmail) {
            toast.error("No email found. Please sign up again.");
            router.push("/signup");
            return;
        }

        setIsResending(true);

        try {
            const result = await resendVerification(verificationEmail);

            if (result.success) {
                toast.success("Verification code sent! Check your email.");
                setOtp("");
            } else {
                toast.error(result.error || "Failed to resend code");
            }
        } catch (error) {
            console.error('Resend error:', error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight transition-colors">Check your email</h1>
                    <p className="text-muted-foreground mt-2 transition-colors">
                        We sent a verification code to <span className="font-medium text-foreground">{verificationEmail}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="text-center text-2xl tracking-widest bg-transparent h-14 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary/50"
                            required
                            maxLength={6}
                            pattern="\d{6}"
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full transition-all duration-300 ease-in-out hover:scale-[1.02]"
                        disabled={isLoading || otp.length !== 6}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify Email"
                        )}
                    </Button>
                </form>

                <div className="text-center space-y-4">
                    <Button
                        variant="link"
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-sm text-muted-foreground transition-all duration-300 ease-in-out"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Resend code"
                        )}
                    </Button>

                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/signup")}
                            className="text-muted-foreground transition-all duration-300 ease-in-out"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to sign up
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
