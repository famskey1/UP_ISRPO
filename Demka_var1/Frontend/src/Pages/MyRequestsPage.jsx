import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import RequestsPage from './RequestsPage';
import { getTokenData } from '../../API/TokenUtils';

//страница фильтрации заявок Заказчика
const MyRequestsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentUser = getTokenData();

    useEffect(() => {
        if (currentUser?.userid != id) {
            alert('У вас нет доступа к заявкам другого пользователя');
            navigate(`/my-requests/${currentUser.userid}`);
            return;
        }
        loadMyRequests();
    }, [id, currentUser.userid]);

    const loadMyRequests = useCallback(async () => {
        try {
            setLoading(true);
            const data = await RequestsAPI.getAll();
            const myRequests = data.filter(req => req.clientid == id);
            setRequests(myRequests);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    });

    return (<RequestsPage 
        initialRequests={requests} 
        loading={loading} 
        error={error}
        title="Мои заявки"
        isMyRequests={true}
        userId={id}
    />
);
};

export default MyRequestsPage;