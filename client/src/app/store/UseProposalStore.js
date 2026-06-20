
import { create } from "zustand";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const useProposalStore = create((set, get) => ({
    proposals: [],
    currentProposal: null,
    isLoading: false,
    error: null,

    // Fetch all proposals for a company (sent, received, or both)
    fetchCompanyProposals: async (companyId, direction) => {
        set({ isLoading: true, error: null });
        try {
            const query = direction ? `?direction=${direction}` : "";
            const response = await fetch(
                `${apiBaseUrl}/proposal/all-proposal/${companyId}${query}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch proposals");
            }
            set({
                proposals: data.payload.proposals,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Fetch a single proposal by its Mongo _id
    fetchProposalById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/proposal/${id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch proposal");
            }
            set({
                currentProposal: data.payload.proposal,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Create a new proposal — expects a FormData object built by the caller
    // (must include proposalType, fromCompany, toCompany, and the file under key "file")
    createProposal: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/proposal/create-proposal`, {
                method: "POST",
                credentials: "include",
                body: formData, // no Content-Type header — browser sets multipart boundary automatically
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to create proposal");
            }
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

    // Respond to a proposal: accept / reject / negotiate / reviewing
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
            if (!response.ok) {
                throw new Error(data.message || "Failed to update proposal status");
            }
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

    clearProposals: () => set({ proposals: [], currentProposal: null, error: null }),
}));

export default useProposalStore;