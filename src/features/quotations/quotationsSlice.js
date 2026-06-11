import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    quotations: [],
    page: 1,
    loading: false,
    hasMore: true,
    search: '',
    tab: 'all',
};

const quotationsSlice = createSlice({
    name: 'quotations',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setSearch: (state, action) => {
            state.search = action.payload;
        },

        setTab: (state, action) => {
            state.tab = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },

        setQuotationData: (state, action) => {
            const { page, data, hasMore } = action.payload;

            state.page = page;
            state.hasMore = hasMore;

            if (page === 1) {
                state.quotations = data;
            } else {
                state.quotations = [...state.quotations, ...data];
            }
        },

        resetQuotationList: (state) => {
            state.quotations = [];
            state.page = 1;
            state.hasMore = true;
        },
    },
});

export const {
    setLoading,
    setSearch,
    setTab,
    setPage,
    setQuotationData,
    resetQuotationList,
} = quotationsSlice.actions;

export default quotationsSlice.reducer;