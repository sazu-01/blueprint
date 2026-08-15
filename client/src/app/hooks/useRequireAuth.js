
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/UseauthStore.js";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


export function useRequireAuth() {
   const [checked, setChecked] = useState(false);
   const router = useRouter();
   const { login, logout } = useAuthStore();

   useEffect(()=> {
   let isMounted = true;
    fetch(`${apiBaseUrl}/auth/me`, {credentials: "include"})
    .then((res) => {
        if(!res.ok) throw new Error();
        return res.json();
    })
    .then((data)=> {
        if(isMounted) {
            login(data.payload.user);
            setChecked(true);
        }
    })
    .catch(()=> {
        if(isMounted) {
            logout()
            router.replace(`/login?redirect=${window.location.pathname}`);
        }
    });
    return () => { isMounted = false; }

   }, []);

   return checked;  
}