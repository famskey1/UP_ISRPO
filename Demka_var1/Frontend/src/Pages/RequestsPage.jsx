import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import { hasRole, getTokenData } from '../../API/TokenUtils';
import '../css/RequestsPage.css';

const RequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const user = getTokenData();

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await RequestsAPI.getAll();
            
            let filteredData = data;
            if (hasRole('Заказчик')) {
                filteredData = data.filter(req => req.clientid === user.userid);
            }
            
            setRequests(filteredData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Новая заявка': return 'status-new';
            case 'В процессе ремонта': return 'status-process';
            case 'Готова к выдаче': return 'status-ready';
            default: return '';
        }
    };

    const filteredRequests = requests.filter(req => {
        if (filter === 'all') return true;
        return req.requestStatus === filter;
    });

    const canCreateRequest = hasRole('Менеджер') || hasRole('Оператор') || hasRole('Заказчик');

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="requests-page">
            <div className="page-header">
                <h1>
                    {hasRole('Заказчик') ? 'Мои заявки' : 'Заявки на ремонт'}
                </h1>
                <div className="header-actions">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Все заявки</option>
                        <option value="Новая заявка">Новые</option>
                        <option value="В процессе ремонта">В работе</option>
                        <option value="Готова к выдаче">Готовые</option>
                    </select>
                    
                    {canCreateRequest && (
                        <Link to="/create-request" className="btn-create">
                            + Новая заявка
                        </Link>
                    )}
                </div>
            </div>

            <div className="requests-grid">
                {filteredRequests.map(request => {
                    const requestId = request?.requestID ?? '???';
                    const techType = request?.homeTechType ?? '—';
                    const techModel = request?.homeTechModel ?? '—';
                    const problemDesc = request?.problemDescryption?.trim() ?? '';
                    const status = request?.requestStatus ?? 'Неизвестно';
                    const masterId = request?.masterID;
                    
                    let startDateStr = 'Дата неизвестна';
                    if (request?.startDate) {
                        try {
                            startDateStr = new Date(request.startDate).toLocaleDateString('ru-RU');
                        } catch {
                            startDateStr = 'Некорректная дата';
                        }
                    }

                    const displayDesc = problemDesc
                        ? (problemDesc.length > 100 
                            ? problemDesc.substring(0, 100) + '...' 
                            : problemDesc)
                        : 'Описание отсутствует';

                    return (
                        <Link 
                            key={requestId}
                            to={`/requests/${requestId}`} 
                            className="request-card"
                        >
                            <div className="card-header">
                                <span className={`status-badge ${getStatusClass(status)}`}>
                                    {status}
                                </span>
                                <span className="request-id">№{requestId}</span>
                            </div>
                            
                            <h3>{techType} {techModel}</h3>
                            
                            <p className="problem-desc">{displayDesc}</p>
                            
                            <div className="card-footer">
                                <span className="date"> {startDateStr}</span>
                                {masterId && (
                                    <span className="master"> Мастер #{masterId}</span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filteredRequests.length === 0 && (
                <div className="no-requests">
                    <p>Заявки не найдены</p>
                </div>
            )}
        </div>
    );
};

export default RequestsPage;