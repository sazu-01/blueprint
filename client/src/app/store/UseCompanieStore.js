import { create } from "zustand";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const useCompanyStore = create((set) => ({
    companies: [],
    isLoading: false,
    error: null,

    fetchAllCompanies: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/companies/all-company`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch companies");
            }

            set({ 
                companies: data.payload.companies, 
                isLoading: false 
            });

        } catch (error) {
            set({ 
                error: error.message, 
                isLoading: false 
            });
        }
    },

    // clear companies
    clearCompanies: () => set({ companies: [], error: null }),
}));

export default useCompanyStore;