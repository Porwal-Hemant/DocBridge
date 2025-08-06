import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:4000/api/user";
// axios.defaults.withCredentials = true;
// This code defines a global authentication state management system using Zustand and Axios. 
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,      // isAuthenticated: true when user will verify their email 
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/register`, { email, password, name });
            set({ user: response.data.user , isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },
    // verifyEmail: async (code) => {
    // 	set({ isLoading: true, error: null });
    // 	try {
    // 		const response = await axios.post(`${API_URL}/verify-email`, { code });
    // 		set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    // 		return response.data;
    // 	} catch (error) {
    // 		set({ error: error.response.data.message || "Error verifying email", isLoading: false });
    // 		throw error;
    // 	}
    // },
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });

            const {  user } = response.data;

            // Store token in localStorage or AppContext (if used)
            // localStorage.setItem('token', token);  // in my case it is already stored before  

            set({ user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },
    
    // checkAuth: async () => {
    //     set({ isCheckingAuth: true, error: null });

    //     const token = localStorage.getItem("token"); // 🔑 read stored token
    //     if (!token) {
    //         set({ isAuthenticated: false, isCheckingAuth: false });
    //         return;
    //     }

    //     try {
    //         const response = await axios.get(`${API_URL}/check-auth`, {
    //             headers: { token } // ✅ send token in headers
    //         });

    //         // Optional: double-check user.isVerified here too
    //         if (response.data.user?.isVerified) {
    //             set({
    //                 user: response.data.user,
    //                 isAuthenticated: true,
    //                 isCheckingAuth: false
    //             });
    //         } else {
    //             set({
    //                 user: null,
    //                 isAuthenticated: false,
    //                 isCheckingAuth: false
    //             });
    //         }
    //     } catch (error) {
    //         set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    //     }
    // }


}));