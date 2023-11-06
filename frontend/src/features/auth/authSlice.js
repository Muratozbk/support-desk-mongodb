import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

export const register = createAsyncThunk('auth/register',
    async (user, thunkApi) => {
        console.log(user)
    });


export const login = createAsyncThunk('auth/login',
    async (user, thunkApi) => {
        console.log(user)
    });

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

    }
});
// 131
export default authSlice.reducer