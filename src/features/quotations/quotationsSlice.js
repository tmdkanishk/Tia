import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    quotations: [],
    page: 1,
    loading: false,
    hasMore: true,
    search: '',
    tab: 'all',
    refresh: false
};

const quotationsSlice = createSlice({
    name: 'quotations',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setRefresh: (state, action) => {
            state.refresh = action.payload;
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

        removeQuotation: (state, action) => {
            const { id, type } = action.payload || {};
            state.quotations = state.quotations.filter((item) => {
                const sameId = String(item?.id) === String(id);
                if (!sameId) return true;
                if (!type) return false;
                const itemType = String(item?.type || item?.quoteType || '').toLowerCase();
                return itemType !== String(type).toLowerCase();
            });
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
    setRefresh,
    setSearch,
    setTab,
    setPage,
    setQuotationData,
    removeQuotation,
    resetQuotationList,
} = quotationsSlice.actions;

export default quotationsSlice.reducer;