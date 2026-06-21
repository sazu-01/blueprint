import { create } from "zustand";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const useProposalTextStore = create((set, get) => ({
    texts: [],
    isLoading: false,
    error: null,

    // Fetch full message thread for a proposal
    fetchTexts: async (proposalId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(
                `${apiBaseUrl}/proposal/${proposalId}/text`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch messages");
            }
            set({
                texts: data.payload.texts,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Send a new message, then refetch the full thread so senderCompany/senderUser
    // come back fully populated rather than relying on the create response
    sendText: async (proposalId, senderCompany, text) => {
        set({ error: null });
        try {
            const response = await fetch(
                `${apiBaseUrl}/proposal/${proposalId}/text`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ senderCompany, text }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to send message");
            }

            // Refetch instead of appending locally — guarantees populated
            // senderCompany/senderUser fields, matching what GetText returns
            await get().fetchTexts(proposalId);

            return data.payload.text;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    clearTexts: () => set({ texts: [], error: null }),
}));

export default useProposalTextStore;