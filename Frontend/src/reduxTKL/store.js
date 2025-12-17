// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authslice.js";
// import chatReducer from "./chat/chatSlice";
// import movieReducer from "./movies/movieSlice";

// export const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         chat: chatReducer,
//         movies: movieReducer,
//     },
// });
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "./AuthSlice";
import chatReducer from "../reduxtKL/chat/chatSlice";
import movieReducer from "../reduxTKL/movies/movieSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

const persistConfig = { key: "root", storage, whitelist: ["auth"] };

const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    movies: movieReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

