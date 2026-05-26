import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    role: null,
    refreshToken: null,
    accessToken: null,
    isAuthenticated: false,
    isVerified: false,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload
        },

        setCredentials: (state, action) => {
            const { accessToken, refreshToken, role, isAuthenticated, isVerified, user } = action.payload;
            if (accessToken !== undefined) state.accessToken = accessToken;
            if (refreshToken !== undefined) state.refreshToken = refreshToken;
            if (role !== undefined) state.role = role;
            if (isAuthenticated !== undefined) state.isAuthenticated = isAuthenticated;
            if (isVerified !== undefined) state.isVerified = isVerified;
            if (user !== undefined) state.user = user;
            // state.isAuthenticated = true;
            //  state.isVerified = true;  // Set to true to allow direct navigation to Dashboard after login
        },
        setVerified: (state, action) => {
            state.isVerified = true;
        },
        logout: (state, action) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.role = null;
            state.isAuthenticated = false;
            state.isVerified = false;
            state.user=null;
        }
    }
})

export const { setRole, setCredentials, logout, setVerified } = authSlice.actions;
export default authSlice.reducer;
