import { useState, useEffect, ReactNode } from "react";

interface AuthGuardProps {
    children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const [isAuthResolved, setIsAuthResolved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const resolveAuth = async () => {
            const storedUserId = sessionStorage.getItem("user_id");

            if (storedUserId) {
                setIsAuthResolved(true);
                return;
            }

            const params = new URLSearchParams(window.location.search);
            const token = params.get("brain_dump.token");

            if (!token) {
                window.location.href = "https://mantracare.com/token"; // Fallback to token page
                return;
            }

            try {
                const response = await fetch("https://api.mantracare.com/user/user-info", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error("Authentication failed");
                }

                const data = await response.json();

                if (data.user_id) {
                    sessionStorage.setItem("user_id", data.user_id.toString());

                    // Clean URL
                    const url = new URL(window.location.href);
                    url.searchParams.delete("token");
                    window.history.replaceState({}, "", url.pathname + url.search);

                    setIsAuthResolved(true);
                } else {
                    throw new Error("Invalid user info returned");
                }
            } catch (err) {
                console.error("Auth error:", err);
                window.location.href = "https://mantracare.com/token";
            }
        };

        resolveAuth();
    }, []);

    if (!isAuthResolved) {
        return (
            <div className="min-h-screen flex items-center justify-center gradient-calm">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-muted-foreground animate-pulse text-sm">Authenticating...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
