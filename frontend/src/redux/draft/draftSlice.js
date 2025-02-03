import { createSlice } from "@reduxjs/toolkit";

const draftSlice = createSlice({
  name: "draft",
  initialState: {
    draft: { title: "", body: "", images: [] },
  },
  reducers: {
    setDraft: (state, action) => {
      state.draft = action.payload;
    },
    clearDraft: (state) => {
      state.draft = { title: "", body: "", images: [] };
    },
  },
});

export const { setDraft, clearDraft } = draftSlice.actions;
export default draftSlice.reducer;
