import {BASE_URL} from './BaseData'
import { fetchWithErrorHandling, fetchWithFormData } from './FetchWithErrorHandling';
import { isAuthenticated, getCurrentUserId, hasRole, getToken } from './TokenUtils';

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

    update: async(id, commentData) =>{
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }

        const commentToUpdate = {
            commentid: parseInt(id),
            message: commentData.message,
            masterid: commentData.masterid? parseInt(commentData.masterid) : null,
            requestid: commentData.requestid? parseInt(commentData.requestid): null,
        };
        if (isNaN(commentToUpdate.commentid) || isNaN(commentToUpdate.masterid) || isNaN(commentToUpdate.requestid)) {
            throw new Error('Некорректные ID в данных комментария');
        }
        const response = await fetch(`${BASE_URL}/comments/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(commentToUpdate)
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Ошибка при обновлении комментария');
        }
        return await response.json();
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
    
    create: async (commentData) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        
        return fetchWithErrorHandling(`${BASE_URL}/comments/create`,{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(commentData)
    })
    }
}