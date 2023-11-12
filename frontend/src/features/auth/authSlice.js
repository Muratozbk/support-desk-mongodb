import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import authService from "./authService";

// Get user from local storage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    // isError: false,
    // isSuccess: false,
    isLoading: false,
    // message: ''
};

export const register = createAsyncThunk('auth/register',
    async (user, thunkApi) => {
        try {
            return await authService.register(user)
        } catch (error) {
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message ||
                error.toString()

            return thunkApi.rejectWithValue(message)
        }
    });


export const login = createAsyncThunk('auth/login',
    async (user, thunkApi) => {
        try {
            return await authService.login(user)
        } catch (error) {
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message ||
                error.toString()

            return thunkApi.rejectWithValue(message)
        }
    });

// Logout user
export const logout = createAction('auth/logout', () => {
    authService.logout()

    return {}
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(register.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
            })
        // .addCase(logout.fulfilled, (state) => {
        //     state.user = null
        // })
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer
