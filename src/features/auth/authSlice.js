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
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.role = role;
            state.isAuthenticated = isAuthenticated;
            state.isVerified = isVerified;
            state.user=user
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
