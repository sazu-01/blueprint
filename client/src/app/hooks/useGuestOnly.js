
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/UseauthStore.js";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useGuestOnly() {

    const [checked, setChecked] = useState(false);
    const router = useRouter();
    const { login } = useAuthStore();

    useEffect(() => {
        let isMounted = true;
        fetch(`${apiBaseUrl}/auth/me`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error(); // not logged in — this is fine, stay here
                return res.json();
            })
            .then((data) => {
                if (isMounted) {
                    login(data.payload.user);
                    router.replace("/"); // already logged in — bounce away
                }
            })
            .catch(() => {
                if (isMounted) setChecked(true); // confirmed logged out — safe to show the page
            });
        return () => { isMounted = false; };
    }, []);

    return checked;
}