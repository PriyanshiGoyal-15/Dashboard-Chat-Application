import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../API/API"
import api_endPoints from "../API/Api_endPoints";

// Login
export const loginUser = createAsyncThunk(
    "Auth/loginUser",
    async ({ email, password }, thunkAPI) => {
        try {
            const res = await api.post(api_endPoints.LOGIN, { email, password });

            // const token = res.data.token;
            // const user = res.data.user || null; 
            const token = res.data.token ?? res.data?.accessToken ?? null;
            const user = res.data.user ?? res.data?.userData ?? { email };

            if (!token) {
                return thunkAPI.rejectWithValue("Token missing from API response");
            }

            // save
            localStorage.setItem("token", token);
            if (user) localStorage.setItem("user", JSON.stringify(user));

            return { token, user };
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "LOGIN FAILED"
            );
        }
    }
);


// signup
export const signupUser = createAsyncThunk(
    "Auth/signupUser",
    async (formData, thunkAPI) => {
        try {
            const res = await api.post(api_endPoints.SIGNUP, formData)
            return res.data;
        }
        catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "SignUp Failed"
            )
        }
    }
)