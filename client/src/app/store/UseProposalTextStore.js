

import { create } from "zustand";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const useProposalTextStore = create((set) => ({
    isLoading: false,
    error: null,

    sendText: async (proposalId, senderCompany, text, file = null) => {
        set({ error: null });
        try {
            let body, headers;

            if (file) {
                // File present — must use FormData (multipart)
                const formData = new FormData();
                formData.append("senderCompany", senderCompany);
                if (text?.trim()) formData.append("text", text.trim());
                formData.append("file", file);
                body = formData;
                headers = {}; // browser sets multipart boundary automatically
            } else {
                // Text only — plain JSON
                body = JSON.stringify({ senderCompany, text });
                headers = { "Content-Type": "application/json" };
            }

            const response = await fetch(
                `${apiBaseUrl}/proposal/${proposalId}/text`,
                {
                    method: "POST",
                    credentials: "include",
                    headers,
                    body,
                }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to send message");
            return data.payload.text; // populated ProposalText doc
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },
}));

export default useProposalTextStore;