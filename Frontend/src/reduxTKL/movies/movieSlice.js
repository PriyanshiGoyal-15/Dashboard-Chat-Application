import { createSlice } from "@reduxjs/toolkit";
import { fetchPopularMovies } from "./movieThunks";

const movieSlice = createSlice({
    name: "movies",
    initialState: {
        list: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularMovies.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPopularMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchPopularMovies.rejected, (state) => {
                state.loading = false;
                state.list = [];
            });
    },
});

export default movieSlice.reducer;
