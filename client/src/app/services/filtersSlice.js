import { createSlice } from "@reduxjs/toolkit";

const initialFiltersState = {
    activeFilter: 'untagged',
    tagList: []
}

export const filterSlice = createSlice({
    name: 'filters',
    initialState: initialFiltersState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload
        },
    },
});

export const { activeFilterChanged } = filterSlice.actions;

export default filterSlice.reducer;
