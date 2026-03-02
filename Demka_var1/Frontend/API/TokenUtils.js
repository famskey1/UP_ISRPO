import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = 'access_token';

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getTokenData = () => {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;
    try {
        const data = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return data.exp > currentTime;
    } catch {
        return false;
    }
};

export const getCurrentUserId = () => {
    const data = getTokenData();
    return data?.userId || data?.sub || null;
};

export const getCurrentUserRole = () => {
    const data = getTokenData();
    return data?.role || null;
};

export const hasRole = (role) => {
    const userRole = getCurrentUserRole();
    return userRole === role;
};