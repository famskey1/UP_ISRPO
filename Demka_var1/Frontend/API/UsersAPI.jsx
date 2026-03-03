import {BASE_URL} from './BaseData'
import { fetchWithErrorHandling, fetchWithFormData } from './fetchWithErrorHandling';
import { isAuthenticated, getCurrentUserId, hasRole, setToken } from './TokenUtils';

export const UsersAPI = {
     login: async (login, password) => {
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                 login: login, 
                 password: password }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Неверный логин или пароль');
        }
        
        const data = await response.json();
        
        if (data.token) {
            setToken(data.token);
        }
        
        return data;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        window.location.href = '/';
    },

    getAll: async () => {
        return fetchWithErrorHandling(`${BASE_URL}/users`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        });
    },

    getOne: async (id) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        return fetchWithErrorHandling(`${BASE_URL}/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    },

    update: async (id, formData) => {
        if (!isAuthenticated()) {
          throw new Error('Необходимо войти в систему');
        }

        if (!hasRole('Admin') && getCurrentUserId() != id) {
            throw new Error('Вы можете редактировать только свой профиль');
        }
        
        return fetchWithFormData(`${BASE_URL}/users/update/${id}`, 
            formData, 'PATCH');
    },

    delete: async (id) => {
        if (!hasRole('Admin')) {
            throw new Error('Только администратор может удалять пользователей');
        }
        if (getCurrentUserId() == id) {
            throw new Error('Нельзя удалить свою учетную запись');
        }

        return fetchWithErrorHandling(`${BASE_URL}/users/delete/${id}`, {
            method: "DELETE"
        });
    },
    
    create: async (request) => {
        return protectedFetch(`${BASE_URL}/users/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: request
        })
    }
}