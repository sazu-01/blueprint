

import { create } from "zustand";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const usePostStore = create((set, get) => ({
    posts: [],
    currentPost: null,
    pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },
    isLoading: false,
    error: null,

    // Fetch the feed — optional industry/postType filters, paginated
    fetchAllPosts: async ({ industry, postType, page = 1, limit = 20 } = {}) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            if (industry) params.append("industry", industry);
            if (postType) params.append("postType", postType);
            params.append("page", page);
            params.append("limit", limit);

            const response = await fetch(
                `${apiBaseUrl}/post/all-post?${params.toString()}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch posts");
            }
            set({
                posts: data.payload.posts,
                pagination: data.payload.pagination,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Fetch a single post by id
    fetchPostById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/post/${id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch post");
            }
            set({
                currentPost: data.payload.post,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchPostsByCompany: async (companyId) => {
    set({ isLoading: true, error: null });
    try {
        const response = await fetch(
            `${apiBaseUrl}/post/all-post?company=${companyId}`,
            {
                method: "GET",
                credentials: "include",
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch posts");
        }
        // filter client-side since backend doesn't have company filter yet
        const companyPosts = data.payload.posts.filter(
            (p) => p.company?._id?.toString() === companyId
        );
        set({
            posts: companyPosts,
            isLoading: false,
        });
    } catch (error) {
        set({ error: error.message, isLoading: false });
    }
},

    // Create a new post
    createPost: async ({ company, content, postType, relatedIndustry }) => {
        set({ error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/post/create-post`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ company, content, postType, relatedIndustry }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to create post");
            }
            set((state) => ({
                posts: [data.payload.post, ...state.posts],
            }));
            return data.payload.post;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    // Update an existing post — only fields the caller passes are sent
    updatePost: async (id, updates) => {
        set({ error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/post/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updates),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update post");
            }
            set((state) => ({
                posts: state.posts.map((p) => (p._id === id ? data.payload.post : p)),
                currentPost:
                    state.currentPost?._id === id ? data.payload.post : state.currentPost,
            }));
            return data.payload.post;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    // Delete a post
    deletePost: async (id) => {
        set({ error: null });
        try {
            const response = await fetch(`${apiBaseUrl}/post/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to delete post");
            }
            set((state) => ({
                posts: state.posts.filter((p) => p._id !== id),
                currentPost: state.currentPost?._id === id ? null : state.currentPost,
            }));
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    clearPosts: () => set({ posts: [], currentPost: null, error: null }),
}));

export default usePostStore;