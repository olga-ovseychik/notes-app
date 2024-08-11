import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from "./authSlice";
import { baseUrl } from './config';


const baseQuery = fetchBaseQuery({
    baseUrl: `${baseUrl}`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 403) {
        // console.log('sending refresh token');

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult.data) {
            api.dispatch(setCredentials({ ...refreshResult.data }));
            result = await baseQuery(args, api, extraOptions);

        } else {
            await api.dispatch(apiSlice.endpoints.logout.initiate());
            // console.log('Your login has expired.');
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Note', 'Task', 'Filter'],
    refetchOnReconnect: true,
    endpoints: (builder) => ({})
})