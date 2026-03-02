import { BASE_URL } from './BaseData';
import { getToken, removeToken } from './TokenUtils';

export const fetchWithErrorHandling = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });
        
        if (response.status === 401) {
            removeToken();
            window.location.href = '/login';
            throw new Error('Сессия истекла. Войдите снова.');
        }
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Ошибка ${response.status}`);
        }
        
        if (response.status === 204) {
            return { success: true };
        }
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка запроса:', error);
        throw error;
    }
};

export const fetchWithFormData = async (url, formData, method = 'POST') => {
    const token = getToken();
    const headers = {};
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: formData,
        });
        
        if (response.status === 401) {
            removeToken();
            window.location.href = '/login';
            throw new Error('Сессия истекла');
        }
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Ошибка ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка запроса:', error);
        throw error;
    }
};