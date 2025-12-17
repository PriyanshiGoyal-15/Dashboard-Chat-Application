
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/API";

export const fetchAdminStats = createAsyncThunk(
    "chat/fetchAdminStats",
    async (_, thunkAPI) => {
        try {
            const res = await API.get("/admin/stats");
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || "Error");
        }
    }
);

