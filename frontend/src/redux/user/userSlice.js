import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await fetch("/api/v1/users/get-auth-user", {
    method: "GET",
  });

  const data = await response.json();
  if (!response.ok || data.success === false)
    throw new Error("Could not fetch user");
  return data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    error: null,
    loading: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.authUser = action.payload;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.loading[action.meta?.arg] = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        delete state.loading[action.meta?.arg];
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message;
        delete state.loading[action.meta?.arg];
      });
  },
});

export const { setUser, clearUser, setLoading, clearLoading } =
  userSlice.actions;
export default userSlice.reducer;
