import { apiSlice } from "./apiSlice";
const FILTERS_URL = '/filters';


export const filtersApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getFilters: build.query({
            query: () => ({
                url: FILTERS_URL,
                method: 'GET'
            }),
            providesTags: (result) => 
                result
                ? [
                    ...result.map(({ _id }) => ({ type: 'Filter', _id })),
                    { type: 'Filter', id: 'LIST' },
                ]
                : [{ type: 'Filter', id: 'LIST' }],
        }),

    })
});

export const {
    useGetFiltersQuery,
} = filtersApiSlice;