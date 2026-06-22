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

    // add inside useCompanyStore, alongside fetchAllCompanies/clearCompanies
updateCompany: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
        const response = await fetch(`${apiBaseUrl}/company/${id}`, {
            method: "PATCH",
            credentials: "include",
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to update company");
        }
        set((state) => ({
            companies: state.companies.map((c) =>
                c._id === id ? data.payload.company : c
            ),
            isLoading: false,
        }));
        return data.payload.company;
    } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
    }
},

    // clear companies
    clearCompanies: () => set({ companies: [], error: null }),
}));

export default useCompanyStore;