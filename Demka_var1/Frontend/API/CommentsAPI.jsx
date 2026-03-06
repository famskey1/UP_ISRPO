import {BASE_URL} from './BaseData'
import { fetchWithErrorHandling, fetchWithFormData } from './FetchWithErrorHandling';
import { isAuthenticated, getCurrentUserId, hasRole } from './TokenUtils';

export const CommentsAPI = {
    getAll: async () => {
        return fetchWithErrorHandling(`${BASE_URL}/comments`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        });
    },

    getOne: async (id) => {
        return fetchWithErrorHandling(`${BASE_URL}/comments/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    },

    update: async(id, formData) =>{
         if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        
        const authorId = formData.get('authorId');
        if (!hasRole('Админ') && getCurrentUserId() != authorId) {
            throw new Error('Вы можете редактировать только свои комментарии');
        }
        
        return fetchWithFormData(`${BASE_URL}/comments/update/${id}`, 
            formData, 'PATCH');
    },

    delete: async (id, authorId) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        if (!hasRole('Админ') && getCurrentUserId() != authorId) {
            throw new Error('Вы можете удалять только свои комментарии');
        }

        return fetchWithErrorHandling(`${BASE_URL}/comments/delete/${id}`, {
            method: "DELETE"
        });
    },
    
    create: async (formData) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        
        return fetchWithFormData(`${BASE_URL}/comments/create`, 
            formData, 'POST');
    }
}