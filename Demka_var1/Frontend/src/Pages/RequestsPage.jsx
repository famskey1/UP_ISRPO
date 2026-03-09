import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import { hasRole, getTokenData } from '../../API/TokenUtils';
import '../css/RequestsPage.css';

const RequestsPage = ({ initialRequests, loading: externalLoading, error: externalError, title, isMyRequests, userId }) => {
    const [requests, setRequests] = useState(initialRequests || []);
    const [loading, setLoading] = useState(!initialRequests);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const user = getTokenData();

    useEffect(() => {
        if (!initialRequests) {
        loadRequests();
        }else{
            setRequests(initialRequests);
            setLoading(false);
        }
    }, [initialRequests]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await RequestsAPI.getAll();
            
            let filteredData = data;
            if (hasRole('Заказчик')) {
                filteredData = data.filter(req => req.clientid === user?.userid);
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
        return req.requeststatus === filter;
    });

    if (loading || externalLoading) return <div className="loading">Загрузка...</div>;
    if (error || externalError) return <div className="error">{error || externalError}</div>;

    return (
        <div className="requests-page">
            <div className="page-header">
                <h1>
                    {title|| user?.type == "Заказчик" ? 'Мои заявки' : 'Заявки на ремонт'}
                </h1>
                <div className="header-actions">
                    <select value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                    >
                        <option value="all">Все заявки</option>
                        <option value="Новая заявка">Новые</option>
                        <option value="В процессе ремонта">В работе</option>
                        <option value="Готова к выдаче">Готовые</option>
                    </select>
                    <Link to="/create-request" className="btn-create">
                        + Новая заявка
                    </Link>
                </div>
            </div>

            <div className="requests-grid">
                {filteredRequests.map(request => {
                    const requestId = request?.requestid ?? '???';
                    const techType = request?.hometechtype ?? '—';
                    const techModel = request?.hometechmodel ?? '—';
                    const problemDesc = request?.problemdescryption?.trim() ?? '';
                    const requestStatus = request?.requeststatus ?? 'Неизвестно';
                    const masterId = request?.masterid;
                    
                    let startDateStr = 'Дата неизвестна';
                    let endDateStr = 'Щас';
                    if (request?.startdate) {
                        try {
                            const datestart = new Date(request.startdate);
                            startDateStr = datestart.toLocaleDateString('ru-RU');
                        } catch {
                            startDateStr = 'Некорректная дата';
                        }
                    }
                    if (request?.completiondate) {
                        try {
                            const dateend = new Date(request.completiondate);
                            endDateStr = dateend.toLocaleDateString('ru-RU');;
                        } catch {
                            endDateStr = 'Некорректная дата';
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
                                <span className={`status-badge ${getStatusClass(requestStatus)}`}>
                                    {requestStatus}
                                </span>
                                <span className="request-id">№{requestId}</span>
                            </div>
                            
                            <h3>{techType} {techModel}</h3>
                            
                            <p className="problem-desc">{displayDesc}</p>
                            
                            <div className="card-footer">
                                <span className="date"> {startDateStr} - {endDateStr}</span>
                                {request.masterid && (
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