import {BASE_URL} from './BaseData'
import { fetchWithErrorHandling, fetchWithJSON } from './FetchWithErrorHandling';
import { isAuthenticated, getCurrentUserId, hasRole, setToken, getToken} from './TokenUtils';

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

    update: async (id, userData) => {
    if (!isAuthenticated()) {
        throw new Error('Необходимо войти в систему');
    }

    if (!hasRole('Админ') && getCurrentUserId() != id) {
        throw new Error('Вы можете редактировать только свой профиль');
    }
    const userToUpdate = {
        userid: parseInt(id), 
        fio: userData.fio,
        phone: userData.phone,
        login: userData.login,
        password: userData.password || null,
        type: userData.type
    };
    
    if (!userToUpdate.password) {
        delete userData.password;
    }

    if (userToUpdate.type) {
        userToUpdate.type = userData.type;
    }
    if (userToUpdate.password && userData.password.trim() !== '') {
        userToUpdate.password = userData.password;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(userToUpdate)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', errorText);
            throw new Error(`Ошибка ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
},

    delete: async (id) => {
        if (!hasRole('Админ')) {
            throw new Error('Только администратор может удалять пользователей');
        }
        if (getCurrentUserId() == id) {
            throw new Error('Нельзя удалить свою учетную запись');
        }

        return fetchWithErrorHandling(`${BASE_URL}/users/delete/${id}`, {
            method: "DELETE"
        });
    },
    
    create: async (userData) => {
        const { userid, ...dataToSend } = userData; 
        
        const response = await fetch(`${BASE_URL}/users/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(dataToSend)
        })
        if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Ошибка при создании пользователя');
    }

    return await response.json();
    }
}