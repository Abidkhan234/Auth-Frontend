import axios from 'axios'
import { handleLogout, handleTokenRefresh } from '../redux/authSlice/authSlice.js';


const Axios = axios.create({
    baseURL: `${import.meta.env.VITE_URL}`,
});

Axios.interceptors.request.use(
    (config) => {
        const { accessToken } = JSON.parse(localStorage.getItem("persist:root"));
        if (accessToken && config.method === "get") {
            config.headers["authorization"] = accessToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // check for 401 and no retry yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const resultAction = await store.dispatch(handleTokenRefresh());

                if (handleTokenRefresh.fulfilled.match(resultAction)) {
                    const newToken = resultAction.payload.newAccessToken;
                    originalRequest.headers["authorization"] = newToken;

                    return Axios(originalRequest); // retry original request
                } else {
                    store.dispatch(handleLogout());
                    return Promise.reject(error);
                }
            } catch (err) {
                store.dispatch(logout());
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default Axios;