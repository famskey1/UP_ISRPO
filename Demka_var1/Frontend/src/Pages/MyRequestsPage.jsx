import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import RequestsPage from './RequestsPage';

//страница фильтрации заявок Заказчика
const MyRequestsPage = () => {
    const { id } = useParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadMyRequests();
    }, [id]);

    const loadMyRequests = async () => {
        try {
            setLoading(true);
            const data = await RequestsAPI.getAll();
            const myRequests = data.filter(req => req.clientID == id);
            setRequests(myRequests);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return <RequestsPage 
        initialRequests={requests} 
        loading={loading} 
        error={error}
        title="Мои заявки"
    />;
};

export default MyRequestsPage;