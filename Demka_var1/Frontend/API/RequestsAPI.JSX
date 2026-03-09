import {BASE_URL} from './BaseData'
import { fetchWithErrorHandling, fetchWithFormData } from './FetchWithErrorHandling';
import { isAuthenticated, getCurrentUserId, hasRole, getToken } from './TokenUtils';

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

    update: async (id, reqData) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        const requestToUpdate = {
            requestid: parseInt(id),
            requeststatus: reqData.requeststatus,
            hometechtype:reqData.hometechtype,
            hometechmodel:reqData.hometechmodel,
            problemdescryption:reqData.problemdescryption,
            repairparts: reqData.repairparts || '',
            masterid: reqData.masterid ? parseInt(reqData.masterid) : null,
            completiondate: reqData.completiondate || null,
            clientid: reqData.clientid ? parseInt(reqData.clientid) : null,
            startdate: reqData.startdate
        };

       const response = await fetch(`${BASE_URL}/requests/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(requestToUpdate)
    });
    
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Ошибка при обновлении заявки');
        }
        return await response.json();
    
    },

    delete: async (id) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        
        if (!hasRole('Админ')) {
            throw new Error('Только администратор может удалять заявки');
        }

        return fetchWithErrorHandling(`${BASE_URL}/requests/delete/${id}`, {
            method: "DELETE"
        });
    },
    
    create: async (requestData) => {
        if (!isAuthenticated()) {
            throw new Error('Необходимо войти в систему');
        }
        
        return fetchWithErrorHandling(`${BASE_URL}/requests/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
    }
}