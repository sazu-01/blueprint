
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (userData) => set({
                user: userData,
                isAuthenticated: true
            }),

            logout: () => set({
                user: null,
                isAuthenticated: false
            }),

            updateUser: (updatedData) => set((state) => ({
                user: { ...state.user, ...updatedData }
            })),
        }),
        {
            name: "auth-storage", //persists to localStorage automatically
        }
    )
);

export default useAuthStore;