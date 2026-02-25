import {base_url} from './BaseData'
import { jwtDecode } from "jwt-decode";

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

    update: async (request) => {
        var token = getCookie(UGC_COOKIE)
        if(token == undefined) return;
        const data = jwtDecode(token);
        if(data.userId != request.authorId) return;
        return protectedFetch(`${BASE_URL}/requests/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: request
        })
    },

    delete: async (id) => {
        var token = getCookie(UGC_COOKIE)
        if(token == undefined) return;
        const data = jwtDecode(token);
        if(data.role != 'Admin' || data.userId != request.authorId) return;

        return protectedFetch(`${BASE_URL}/requests/delete/${id}`,{
            method: "DELETE"
        })
    },
    
    create: async (request) => {
        return protectedFetch(`${BASE_URL}/requests/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: request
        })
    }
}