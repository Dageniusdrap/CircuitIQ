"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Loader2, AlertTriangle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { showLogoutSuccess } from "@/lib/auth-toasts";

interface LogoutConfirmDialogProps {
    trigger?: React.ReactNode;
    onLogout?: () => void;
}

export function LogoutConfirmDialog({ trigger, onLogout }: LogoutConfirmDialogProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            // Show success toast before redirect
            showLogoutSuccess();

            // Small delay to show the toast
            await new Promise(resolve => setTimeout(resolve, 500));

            // Trigger callback if provided
            onLogout?.();

            // Sign out and redirect to home
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700 max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-amber-500/10">
                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                        </div>
                        <AlertDialogTitle className="text-xl text-white m-0">
                            Sign Out?
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-slate-400">
                        Are you sure you want to sign out? You&apos;ll need to sign in again to access your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="bg-slate-800/50 rounded-xl p-4 my-4 border border-slate-700/50">
                    <p className="text-sm text-slate-400">
                        <span className="text-cyan-400 font-medium">Quick tip:</span> Any unsaved changes will be preserved when you sign back in.
                    </p>
                </div>

                <AlertDialogFooter className="gap-3 sm:gap-3">
                    <AlertDialogCancel
                        className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                        disabled={isLoggingOut}
                    >
                        Stay Signed In
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="bg-red-500 hover:bg-red-600 text-white border-0"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing Out...
                            </>
                        ) : (
                            <>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
