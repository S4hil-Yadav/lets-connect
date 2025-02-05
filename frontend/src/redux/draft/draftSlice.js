import { createSlice } from "@reduxjs/toolkit";

const draftSlice = createSlice({
  name: "draft",
  initialState: {
    draft: { title: "", body: "", images: [] },
    posting: false,
  },
  reducers: {
    setDraft: (state, action) => {
      state.draft = action.payload;
    },
    clearDraft: (state) => {
      state.draft = { title: "", body: "", images: [] };
      state.posting = false;
    },
    setPosting: (state) => {
      state.posting = true;
    },
    clearPosting: (state) => {
      state.posting = false;
    },
  },
});

export const { setDraft, clearDraft, setPosting, clearPosting } =
  draftSlice.actions;
export default draftSlice.reducer;
