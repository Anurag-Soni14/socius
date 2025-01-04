import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        // post: null,
    },
    reducers: {
        //actions
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        // setPost: (state, action) => {
        //     state.posts = action.payload;
        // },
    },
})

export const {setPosts} = postSlice.actions;

export default postSlice.reducer;