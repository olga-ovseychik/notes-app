import { createSlice } from "@reduxjs/toolkit";

const initialFilterTagState = { tagFilter: [] }

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: initialFilterTagState,
    reducers: {
        tagFilterChanged: (state, action) => {
            state.tagFilter = action.payload
        }
    }
})

export const { tagFilterChanged } = tagsSlice.actions;

export default tagsSlice.reducer;