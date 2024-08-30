import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import { apiSlice } from "../api/apiSlice";

// Create an entity adapter for posts
const postsAdapter = createEntityAdapter({
    selectId: (post) => post._id,
    // sortComparer: (a, b) => b.date.localeCompare(a.date)
});

// Define the initial state using the adapter
const initialState = postsAdapter.getInitialState({
    hasNextPage: false
});

// Extend the API slice with endpoints for posts
export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: (page) => `/posts?page=${page}&limit=10`,
            transformResponse: (responseData) => {
                const { posts, hasNextPage } = responseData;
                
                const transformedPosts = posts.map(post => ({
                    ...post,
                    date: post.date || sub(new Date(), { minutes: 1 }).toISOString(),
                    reactions: post.reactions || {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }));

                return {
                    ids: transformedPosts.map(post => post._id),
                    entities: transformedPosts.reduce((acc, post) => {
                        acc[post._id] = post;
                        return acc;
                    }, {}),
                    hasNextPage
                };
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                
                const { ids, entities, hasNextPage } = data;
        
                dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', arg, (draft) => {
                        postsAdapter.upsertMany(draft, entities);
                        draft.hasNextPage = hasNextPage;
                    })
                );
            },
            providesTags: (result) => [
                { type: 'Post', id: "LIST" },
                ...(result && result.ids ? result.ids.map(id => ({ type: 'Post', id })) : [])
            ]
        }),
        
        getPostsByUserId: builder.query({
            query: (userId) => `/posts/user/${userId}`,
            transformResponse: (responseData) => {
                if (!Array.isArray(responseData)) {
                    console.error("Expected an array of posts but received:", responseData);
                    return postsAdapter.setAll(initialState, []);
                }

                const transformedPosts = responseData.map(post => ({
                    ...post,
                    date: post.date || sub(new Date(), { minutes: 1 }).toISOString(),
                    reactions: post.reactions || {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }));

                return postsAdapter.setAll(
                    initialState,
                    transformedPosts.reduce((acc, post) => {
                        acc[post._id] = post;
                        return acc;
                    }, {})
                );
            },
            providesTags: (result) => [
                ...(result ? result.ids.map(id => ({ type: 'Post', id })) : [])
            ]
        }),
        addNewPost: builder.mutation({
            query: (initialPost) => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            invalidatesTags: [{ type: 'Post', id: "LIST" }]
        }),
        updatePost: builder.mutation({
            query: (updatedPost) => ({
                url: `/posts/${updatedPost._id}`,
                method: 'PUT',
                body: updatedPost
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg._id }]
        }),
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
        }),
        addReaction: builder.mutation({
            query: ({ postId, reactions }) => ({
                url: `posts/${postId}`,
                method: 'PATCH',
                body: { reactions }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.postId }]
        })
    })
});

// Export hooks for use in components
export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice;

// Selectors
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
    selectPostsResult,
    (postsResult) => postsResult?.data ?? initialState
);

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors((state) => {
    const postsData = selectPostsData(state);
    return postsData;
});

export const selectHasNextPage = createSelector(
    selectPostsResult,
    (postsResult) => postsResult?.data?.hasNextPage ?? false
);
