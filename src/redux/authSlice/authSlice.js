import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import { isTokenExpired } from '../../Utils/helper';

export const handleRegister = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_URL}/auth/sign-up`, userData)
        return data.message;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data.message)
    }

})

export const handleLogin = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
    try {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const { identifier, password } = userData;

        let payload = { password };

        if (emailRegex.test(identifier)) {
            payload.email = identifier;
        } else {
            payload.userName = identifier;
        }

        const { data } = await axios.post(`${import.meta.env.VITE_URL}/auth/sign-in`, payload)

        return {
            message: data.message,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        };
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data.message);
    }
}
)

export const handleLogout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_URL}/auth/logout`);
        return data.message;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.message)
    }
}
)

export const handleResetPassword = createAsyncThunk("auth/reset-password", async (email, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_URL}/auth/forget-password`, {
            email
        });
        return data.message;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data.message);
    }
}
)

export const handleNewPassword = createAsyncThunk("auth/new-password", async (data, { rejectWithValue }) => {

    const { email, newPassword } = data;

    if (!email || !newPassword) {
        return rejectWithValue("Email & new password are required")
    }

    try {
        const { data } = await axios.post(`${import.meta.env.VITE_URL}/auth/new-password/${email}`, {
            newPassword
        });
        return data.message;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data.message);
    }
}
)

export const handleOTPVerification = createAsyncThunk("auth/verify-otp", async (data, { rejectWithValue }) => {

    const { email, otp } = data;

    if (!email || !otp) {
        return rejectWithValue("Email & OTP is required")
    }

    try {
        const { data } = await axios.post(`${import.meta.env.VITE_URL}/auth/verify-otp/${email}`, {
            otp
        });
        return data.message;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data.message);
    }
}
)

export const handleTokenRefresh = createAsyncThunk(
    "auth/refresh-token",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { refreshToken } = getState().auth;

            if (!refreshToken) {
                return
            }

            const { data } = await axios.post(`${import.meta.env.VITE_URL}/auth/refresh-token`, {
                refreshToken,
            });

            return {
                accessToken: data.accessToken,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Refresh failed");
        }
    }
);

export const handleProfileData = createAsyncThunk(
    "auth/profile-data",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { accessToken } = getState().auth;

            if (!accessToken) {
                return
            }

            if (!isTokenExpired(accessToken)) {
                return;
            }

            const { data } = await axios.get(`${import.meta.env.VITE_URL}/auth/profile-data`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            return {
                email: data.email,
                userName: data.userName
            }
        } catch (error) {
            console.log("Error from handleProfileData", error);
            return rejectWithValue(error.response?.data?.message || "Profile Data fetch failed");
        }
    }
);



export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoading: false,
        accessToken: "",
        refreshToken: "",
        user: {}
    },
    extraReducers: builder => {
        builder
            .addCase(handleRegister.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(handleRegister.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(handleRegister.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(handleLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(handleLogin.fulfilled, (state, actions) => {
                state.isLoading = false;
                state.accessToken = actions.payload.accessToken;
                state.refreshToken = actions.payload.refreshToken;
            })
            .addCase(handleLogin.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(handleLogout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(handleLogout.fulfilled, (state) => {
                state.isLoading = false;
                state.accessToken = "";
                state.refreshToken = "";
                state.user = {};
            })
            .addCase(handleLogout.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(handleResetPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(handleResetPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(handleResetPassword.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(handleOTPVerification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(handleOTPVerification.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(handleOTPVerification.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(handleProfileData.fulfilled, (state, actions) => {
                state.user = {
                    email: actions.payload.email,
                    userName: actions.payload.userName,
                }
            })
            .addCase(handleTokenRefresh.fulfilled, (state, actions) => {
                state.accessToken = actions.payload.accessToken;
            })
    },

    reducers: {
        decoded: (state) => {
            const payload = JSON.parse(atob(state.accessToken.split(".")[1]));
            const { email, userName } = payload;
            state.user = {
                email,
                userName
            }
        },
        updateUserState: (state, actions) => {
            state.user = {
                email: actions.payload.email,
                userName: actions.payload.userName
            };
        },
        reset: (state, actions) => {
            state.accessToken = "";
            state.refreshToken = "";
        },
        updateAccessToken: (state, actions) => {
            state.accessToken = actions.payload;
        }
    }
})


export const { decoded, updateUserState, reset, updateAccessToken } = authSlice.actions

export default authSlice.reducer