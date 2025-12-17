// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
// const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

// // ✅ ONLY ONE EXPORT
// export const fetchPopularMovies = createAsyncThunk(
//     "movies/fetchPopularMovies",
//     async (_, thunkAPI) => {
//         try {
//             const res = await axios.get(BASE_URL, {
//                 headers: {
//                     Authorization: `Bearer ${TOKEN}`,
//                     "Content-Type": "application/json",
//                 },
//             });
//             console.log("movieThunks loaded");


//             return res.data?.results || [];
//         } catch (error) {
//             console.error("Movie API Error:", error);
//             return [];
//         }
//     }
// );
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const MOVIE_URL = import.meta.env.VITE_MOVIE_URL;
const MOVIE_TOKEN = import.meta.env.VITE_MOVIE_API_TOKEN;

export const fetchPopularMovies = createAsyncThunk(
    "movies/fetchPopularMovies",
    async (_, thunkAPI) => {
        try {
            const res = await axios.get(MOVIE_URL, {
                headers: { Authorization: `Bearer ${MOVIE_TOKEN}` },
            });
            return res.data.results;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
