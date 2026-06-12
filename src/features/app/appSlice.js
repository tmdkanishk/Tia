import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    appLoading: false,
    modal: {
        visible: false,
        title: null,
        message: null,
    },
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppLoading: (state, action) => {
            state.appLoading = action.payload;
        },

        showModal: (state, action) => {
            state.modal.visible = true;
            state.modal.title = action.payload.title;
            state.modal.message = action.payload.message;
            
        },

        hideModal: (state) => {
            state.modal = {
                visible: false,
                title: null,
                message: null,
            };
        },
    },
});

export const { setAppLoading, showModal, hideModal } = appSlice.actions;

export default appSlice.reducer;