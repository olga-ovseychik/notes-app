import { apiSlice } from "./apiSlice";

const NOTES_URL = '/notes';

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getNotes: build.query({
            query: (id) => ({
                url: `${NOTES_URL}/user/${id}`,
                method: 'GET'
            }),
            providesTags: (result) => 
                result
                ? [
                    ...result.map(({ _id }) => ({ type: 'Note', _id })),
                    { type: 'Note', id: 'LIST' },
                ]
                : [{ type: 'Note', id: 'LIST' }],
        }),
        getNote: build.query({
            query: (id) => ({
                url: `${NOTES_URL}/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'Note', id }],
        }),
        addNote: build.mutation({
            query: (body) => ({
                url: NOTES_URL,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Note', id: 'LIST' }],
        }),
        editNote: build.mutation({
            query(data){
                const { id, ...body } = data;
                return {
                    url: `${NOTES_URL}/${id}`,
                    method: 'PATCH',
                    body
                }
            },
            invalidatesTags: (note) => [{ type: 'Note', id: note?.id }],
        }),
        deleteNote: build.mutation({
            query(id) {
                return {
                    url: `${NOTES_URL}/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: (note) => [{ type: 'Note', id: note?.id }],
        })
    })
})

export const {
    useGetNotesQuery,
    useGetNoteQuery,
    useAddNoteMutation,
    useEditNoteMutation,
    useDeleteNoteMutation,
} = notesApiSlice;