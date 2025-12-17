import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signupUser } from "./authThunks";

// Load saved data when app starts
const savedToken = localStorage.getItem("token");
const savedUser = JSON.parse(localStorage.getItem("user") || "null");
const savedIsAdmin = JSON.parse(localStorage.getItem("isAdmin") || "false");  //1


const ADMIN_EMAIL = "sneha123@gmail.com";
const ADMIN_PASSWORD = "1234";

const authSlice = createSlice({
    name: "auth",
    // initialState: {
    //     user: savedUser || null,
    //     token: savedToken || null,
    //     isAdmin: false,
    //     error: null,
    //     loading: false,
    // },
    initialState: {           //2
        user: savedUser || null,
        token: savedToken || null,
        isAdmin: savedIsAdmin || false,
        error: null,
        loading: false,
    },


    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = "";
            state.isAdmin = false;         //3
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isAdmin");      //3

        },
        //
        setAdminFlag(state, action) {
            state.isAdmin = !!action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(loginUser.fulfilled, (s, action) => {
                s.loading = false;
                s.token = action.payload.token;
                s.user = action.payload.user;

                const ADMIN_EMAIL = "sneha123@gmail.com";
                s.isAdmin =
                    action.payload.user?.role === "admin" || action.payload.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

                // action.payload.user?.email === ADMIN_EMAIL;
                localStorage.setItem("isAdmin", JSON.stringify(s.isAdmin));
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));

            })
            .addCase(loginUser.rejected, (s, action) => {
                s.loading = false;
                s.error = action.payload || "Login failed";
            })
            .addCase(signupUser.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(signupUser.fulfilled, (s) => { s.loading = false; })
            .addCase(signupUser.rejected, (s, action) => { s.loading = false; s.error = action.payload; });
    }
});

export const { logout, setAdminFlag } = authSlice.actions;
export default authSlice.reducer;

//     extraReducers: (builder) => {
//         builder
//             // LOGIN
//             .addCase(loginUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.token = action.payload.token;
//                 state.user = action.payload.user;

//                 // Save to localStorage
//                 localStorage.setItem("token", action.payload.token);
//                 localStorage.setItem("user", JSON.stringify(action.payload.user));
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // SIGNUP
//             .addCase(signupUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(signupUser.fulfilled, (state) => {
//                 state.loading = false;
//             })
//             .addCase(signupUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
