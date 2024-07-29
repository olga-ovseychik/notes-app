import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token:  null,
    userInfo: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, userInfo } = action.payload;
            state.token = accessToken;
            state.userInfo = userInfo;
        },
        clearCredentials: (state) => {
            state.token = null;
            state.userInfo = null;
        }
    },
    selectors: {
        selectToken: (state) => state.token,
        selectUserInfo: (state) => state.userInfo,
    }
});

export const {
    setCredentials,
    clearCredentials,
} = authSlice.actions;

export default authSlice.reducer;
export const { selectToken, selectUserInfo } = authSlice.selectors;