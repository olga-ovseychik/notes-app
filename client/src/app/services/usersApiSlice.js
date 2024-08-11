import { apiSlice } from "./apiSlice";

const USERS_URL = '/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        registerNewUser: builder.mutation({
            query: (body) => ({
                url: USERS_URL,
                method: 'POST',
                body,     
            }),
            invalidatesTags: [{ type: 'User', id: "LIST" }],
        }),
        updateUserProfile: builder.mutation({
            query: (body) => ({
                url: USERS_URL,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (user) => [{ type: 'User', id: user?.id }],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'User', id }],
        }),
    })
});

export const {  useGetUserQuery,
                useRegisterNewUserMutation,
                useUpdateUserProfileMutation,
                useDeleteUserMutation } = usersApiSlice;