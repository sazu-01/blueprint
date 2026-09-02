
import { create } from "zustand";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const useProposalStore = create((set) => ({
    proposals: [],
    currentProposal: null,
    currentTexts: [], // texts now live here, fetched alongside proposal
    isLoading: false,
    error: null,

    fetchCompanyProposals: async (companyId, direction) => {
        set({ isLoading: true, error: null });
        try {
            const query = direction ? `?direction=${direction}` : "";
            const response = await fetch(
                `${apiBaseUrl}/proposal/all-proposal/${companyId}${query}`,
                { method: "GET", credentials: "include" }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch proposals");
            set({ proposals: data.payload.proposals, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchProposalById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/proposal/${id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch proposal");
            set({
                currentProposal: data.payload.proposal,
                currentTexts: data.payload.texts || [], // store texts here
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Called after a reply is sent — appends the new message without refetching everything
    appendText: (newText) => {
        set((state) => ({ currentTexts: [...state.currentTexts, newText] }));
    },

    createProposal: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/proposal/create-proposal`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to create proposal");
            set((state) => ({
                proposals: [data.payload.proposal, ...state.proposals],
                isLoading: false,
            }));
            return data.payload.proposal;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    respondToProposal: async (id, status, rejectionReason) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/proposal/respond/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status, rejectionReason }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update proposal status");
            set((state) => ({
                proposals: state.proposals.map((p) =>
                    p._id === id ? data.payload.proposal : p
                ),
                currentProposal:
                    state.currentProposal?._id === id
                        ? data.payload.proposal
                        : state.currentProposal,
                isLoading: false,
            }));
            return data.payload.proposal;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearProposals: () => set({ proposals: [], currentProposal: null, currentTexts: [], error: null }),
}));

export default useProposalStore;