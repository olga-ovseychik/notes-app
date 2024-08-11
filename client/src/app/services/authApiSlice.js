import { apiSlice } from "./apiSlice";
import { setCredentials, clearCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(clearCredentials());
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState());
                    }, 1000);
                    window.location.replace("https://notes-app-liard-mu.vercel.app/login"); // for running the docker container: http://localhost:5173/login
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data);
                    const { accessToken } = data;
                    dispatch(setCredentials({ accessToken }));
                } catch (error) {
                    console.log(error);
                }
            }
        })
    })       
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRefreshMutation,
} = authApiSlice;