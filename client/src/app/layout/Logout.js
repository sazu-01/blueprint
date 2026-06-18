"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/UseauthStore';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Logout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/auth/logout/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Logout failed. Please try again.");
      }
      logout(); // clear Zustand + localStorage state
      router.push("/login"); // or wherever makes sense
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className='fixed bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;