import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    post: { title: "", body: "", images: [] },
  },
  reducers: {
    setPost: (state, action) => {
      state.post = action.payload;
    },
    clearUser: (state) => {
      state.authUser = null;
    },
    setLoading: (state, action) => {
      state.loading[action.payload] = true;
    },
    clearLoading: (state, action) => {
      state.loading[action.payload] = false;
    },
  },
});

export const { setUser, clearUser, setLoading, clearLoading } =
  postSlice.actions;
export default postSlice.reducer;
