import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    appLoading: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const {
    setAppLoading
} = appSlice.actions;

export default appSlice.reducer;