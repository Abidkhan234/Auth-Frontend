import axios from "axios";
import toast from "react-hot-toast";

const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
        const expiry = payload.exp * 1000; // convert seconds to ms
        return Date.now() >= expiry;
    } catch (error) {
        console.error("Invalid token:", error);
        return true; //  treat invalid token as expired
    }
};

const refreshToken = async (refreshToken) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_URL}/auth/refresh-token`, {
            refreshToken
        });
        return data.accessToken
    } catch (error) {
        console.log("Error from helper ", error);
        if (error.response.data.status === 401) {
            return "Logout user"
        }
    }
};

export { isTokenExpired, refreshToken }