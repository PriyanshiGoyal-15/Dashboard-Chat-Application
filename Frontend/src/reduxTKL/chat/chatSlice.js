import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminStats } from "./chatThunks";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    stats: null,
    loading: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (s, a) => {
        s.loading = false;
        s.stats = a.payload;
      })
      .addCase(fetchAdminStats.rejected, (s) => {
        s.loading = false;
      });
  }
});

export default chatSlice.reducer;
