import axios from "axios";

const movieApi = axios.create({
    baseURL: import.meta.env.VITE_MOVIE_URL || "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_MOVIE_API_TOKEN}`,
    },
});

export default movieApi;
