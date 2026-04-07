import { useEffect, useState } from "react";
import { query } from "@/lib/mission/db";

const DEV_FALLBACK_USER_ID = "999999999"; // Temporary dev user when API is not yet available

const initUser = async (userId: string) => {
    // Upsert user — do nothing if already exists
    const existingUser = await query("SELECT id FROM users WHERE id = $1", [userId]);
    if (existingUser.length === 0) {
        await query("INSERT INTO users (id) VALUES ($1)", [userId]);
    }
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const [isAuthResolved, setIsAuthResolved] = useState(false);

    useEffect(() => {
        const resolveAuth = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get("mission.token");

                // --- Step 1: Token handshake ---
                if (token) {
                    try {
                        const response = await fetch("https://api.mantracare.com/user/user-info", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ token }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.user_id) {
                                sessionStorage.setItem("user_id", data.user_id.toString());
                                // Remove token from URL cleanly
                                window.history.replaceState({}, "", window.location.pathname);
                            }
                        } else {
                            console.warn("MantraCare API returned:", response.status, "— skipping token auth.");
                        }
                    } catch (fetchError) {
                        // API not reachable (e.g., during local development)
                        console.warn("MantraCare API not reachable:", fetchError);
                    }
                }

                // --- Step 2: Check if we have a valid session ---
                let storedUserId = sessionStorage.getItem("user_id");

                // Graceful dev fallback: assign a dev user so the UI works locally
                // even when the backend API is not yet available.
                if (!storedUserId) {
                    console.warn(
                        "No authenticated user_id found. Using dev fallback user for local testing."
                    );
                    storedUserId = DEV_FALLBACK_USER_ID;
                    sessionStorage.setItem("user_id", storedUserId);
                }

                // --- Step 3: Initialize user in Neon DB ---
                await initUser(storedUserId);
                setIsAuthResolved(true);

            } catch (error) {
                console.error("Auth/DB error:", error);
                // Even if DB init fails (e.g., connection issue), show the UI
                // so the user isn't stuck on a blank/404 screen.
                setIsAuthResolved(true);
            }
        };

        resolveAuth();
    }, []);

    if (!isAuthResolved) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
