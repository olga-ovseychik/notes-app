import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import filtersReducer from './services/filtersSlice';
import authReducer from './services/authSlice';
import tagsReducer from './services/tagsSlice';
import { apiSlice } from "./services/apiSlice";

const authPersistConfig = {
    key: 'auth',
    storage: storage,
}

export const store = configureStore({
    reducer: {
        auth: persistReducer(authPersistConfig, authReducer),
        filters: filtersReducer,
        tags: tagsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
    devTools: true,
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);