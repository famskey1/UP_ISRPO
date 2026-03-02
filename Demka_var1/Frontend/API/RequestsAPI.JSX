import {BASE_URL} from './BaseData'
import { fetchWithErrorHandling, fetchWithFormData } from './fetchWithErrorHandling';
import { isAuthenticated, getCurrentUserId, hasRole } from './TokenUtils';

export const RequestsAPI = {
    getAll: async () => {
        return fetchWithErrorHandling(`${BASE_URL}/requests`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        });
    },

    getOne: async (id) => {
        return fetchWithErrorHandling(`${BASE_URL}/requests/${id}`,{
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
        
        return fetchWithFormData(`${BASE_URL}/requests/update/${id}`, 
            formData, 'PATCH');
    },

    delete: async (id) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        
        if (!hasRole('Admin')) {
            throw new Error('Только администратор может удалять заявки');
        }

        return fetchWithErrorHandling(`${BASE_URL}/requests/delete/${id}`, {
            method: "DELETE"
        });
    },
    
    create: async (fromData) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        
        return fetchWithFormData(`${BASE_URL}/requests/create`, 
            formData, 'POST');
    }
}