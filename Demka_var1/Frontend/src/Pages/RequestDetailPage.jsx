import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import { CommentsAPI } from '../../API/CommentsAPI';
import { hasRole, getCurrentUserRole, getTokenData } from '../../API/TokenUtils';
import CommentList from '../Components/CommentList';
import CommentForm from '../Components/CommentForm';
import '../css/RequestDetailPage.css';

const RequestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = getTokenData();
    const [sendingComment, setSendingComment] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);
    
    const loadData = async () => {
        try {
            const [requestData, commentsData] = await Promise.all([
                RequestsAPI.getOne(id),
                CommentsAPI.getAll()
            ]);
            setRequest(requestData);
            setComments(commentsData.filter(c => c.requestid == id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (text) => {
        if (!text.trim()) return;
        setSendingComment(true);

        try {
            const formData = new FormData();
            formData.append('message', text);
            formData.append('masterid', user?.userid);
            formData.append('requestid', id);

            await CommentsAPI.create(formData);
            loadData();
        } catch (err) {
            alert(err.message);
        }finally {
            setSendingComment(false);
        }
    };
    const handleEditComment = async (commentId, newText) => {
        if (!newText.trim()) return;
        
        try {
            const formData = new FormData();
            formData.append('message', newText);

            await CommentsAPI.update(commentId, formData);
            loadData();
            alert('Комментарий обновлен');
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Удалить комментарий?')) return;
        
        try {
            await CommentsAPI.delete(commentId);
            loadData();
            alert('Комментарий удален');
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };
    const handleUpdateRequest = async (commentId, newText) => {
        try {
            const formData = new FormData();
            formData.append('message', newText);
            await CommentsAPI.update(commentId, formData);
            loadData();
            alert('Комментарий обновлен');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Удалить комментарий?')) return;
        
        try {
            await CommentsAPI.delete(commentId);
            loadData();
            alert('Комментарий удален');
        } catch (err) {
            alert(err.message);
        }
    };
    
    const handleDeleteRequest = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить заявку?')) return;
        alert('Заявка удалена');
        try {
            await RequestsAPI.delete(id);
            alert('Заявка удалена');
            navigate('/requests');
        }catch(err){
            allert(err.message)
        }
    }
    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!request) return <div className="error">Заявка не найдена</div>;

    const canEdit = hasRole('Админ') || hasRole('Мастер')|| hasRole('Менеджер');;
    const canComment = hasRole('Мастер') || hasRole('Заказчик');

    return (
        <div className="detail-page">
            <button onClick={() => navigate(-1)} className="back-btn">
                Назад к списку
            </button>
            <div className="request-detail">
                <div className="detail-header">
                    <h1>Заявка №{request.requestid}</h1>
                    <div className="header-actions">
                        {canEdit && (
                            <button onClick={() => navigate(`/edit-request/${id}`)} className="edit-btn">
                                Редактировать
                                </button>	
                            )}
                        {hasRole('Админ') && (
                            <button onClick={handleDeleteRequest} className="delete-btn">
                                 Удалить
                            </button>
                        )}
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-card">
                        <h3>Информация о заявке</h3>
                        <p><strong>Тип техники:</strong> {request.hometechtype}</p>
                        <p><strong>Модель:</strong> {request.hometechmodel}</p>
                        <p><strong>Описание проблемы:</strong> {request.problemdescryption}</p>
                        <p><strong>Дата создания:</strong> {
                        request.startdate? 
                        new Date(request.startdate).toLocaleDateString('ru-RU'): 'Не указана'}
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>Статус и выполнение</h3>
                        <p><strong>Статус:</strong> 
                            <span className={`status-badge ${getStatusClass(request.requeststatus)}`}>
                                {request.requeststatus}
                            </span>
                        </p>
                        {request.repairparts && (
                            <p><strong>Запчасти:</strong> {request.repairparts}</p>
                        )}
                        {request.completiondate && (
                            <p><strong>Дата завершения:</strong> {
                                new Date(request.completiondate).toLocaleDateString('ru-RU')
                            }</p>
                        )}
                        {request.masterid && (
                            <p><strong>Мастер:</strong> #{request.masterid}</p>
                        )}

                    </div>
                </div>

                <div className="comments-section">
                    <h2>Комментарии ({comments.length})</h2>
                    
                    {canComment && (
                        <CommentForm 
                            onSubmit={handleAddComment}
                            loading={sendingComment}
                        />
                    )}

                    <CommentList 
                        comments={comments}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                    />
                </div>
            </div>
        </div>
    );
};

const getStatusClass = (status) => {
    switch (status) {
        case 'Новая заявка': return 'status-new';
        case 'В процессе ремонта': return 'status-process';
        case 'Готова к выдаче': return 'status-ready';
        default: return '';
    }
};

export default RequestDetailPage;