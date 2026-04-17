import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            tokens: null,
            sessionId: null,
            isAuthenticated: false,
            isLoading: false,
            sessions: [],

            // Actions
            login: (userData, tokens, sessionId) => {
                console.log('AuthStore login called with:', { userData, tokens, sessionId }); // Debug log
                set({
                    user: userData,
                    tokens,
                    sessionId,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                set({
                    user: null,
                    tokens: null,
                    sessionId: null,
                    isAuthenticated: false,
                    isLoading: false,
                    sessions: [],
                });
            },

            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            updateUser: (userData) => {
                set({ user: userData });
            },

            updateTokens: (tokens) => {
                set({ tokens });
            },

            setSessions: (sessions) => {
                set({ sessions });
            },

            // Getters
            getAccessToken: () => get().tokens?.accessToken,
            getRefreshToken: () => get().tokens?.refreshToken,
            getUser: () => get().user,
            isAdmin: () => get().user?.role === 'admin',
            getSessionId: () => get().sessionId,
            getSessions: () => get().sessions,
        }),
        {
            name: 'auth-storage',
            partialize: (state) => {
                const persistedState = {
                    user: state.user,
                    tokens: state.tokens,
                    sessionId: state.sessionId,
                    isAuthenticated: state.isAuthenticated,
                };
                console.log('Persisting to localStorage:', persistedState);
                return persistedState;
            },
        }
    )
);

export default useAuthStore;
