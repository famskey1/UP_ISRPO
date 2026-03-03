import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import { CommentsAPI } from '../../API/CommentsAPI';
import { getCurrentUserId, hasRole, getCurrentUserRole } from '../../API/TokenUtils';
import '../css/RequestDetailPage.css';

const RequestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState('');
    const [repairParts, setRepairParts] = useState('');
    const [status, setStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);

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
            setStatus(requestData.requeststatus);
            setRepairParts(requestData.repairparts || '');
            setComments(commentsData.filter(c => c.requestid == id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const formData = new FormData();
            formData.append('message', commentText);
            formData.append('masterid', user?.userid);
            formData.append('requestid', id);

            await CommentsAPI.create(formData);
            setCommentText('');
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateRequest = async () => {
        try {
            const formData = new FormData();
            formData.append('requeststatus', status);
            formData.append('repairparts', repairParts);
            if (status === 'Готова к выдаче' && !request.completiondate) {
                formData.append('completiondate', new Date().toISOString().split('T')[0]);
            }

            await RequestsAPI.update(id, formData);
            setIsEditing(false);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Удалить заявку?')) return;
        
        try {
            await RequestsAPI.delete(id);
            navigate('/requests');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!request) return <div className="error">Заявка не найдена</div>;

    const canEdit = hasRole('Админ') || hasRole('Мастер');
    const canComment = hasRole('Мастер');

    return (
        <div className="detail-page">
            <button onClick={() => navigate('/requests')} className="back-btn">
                Назад к списку
            </button>

            <div className="request-detail">
                <div className="detail-header">
                    <h1>Заявка №{request.requestid}</h1>
                    <div className="header-actions">
                        {hasRole('Админ') && (
                            <button onClick={handleDelete} className="delete-btn">
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
                        <p><strong>Дата создания:</strong> {new Date(request.startdate).toLocaleDateString('ru-RU')}</p>
                    </div>

                    <div className="info-card">
                        <h3>Статус и выполнение</h3>
                        {isEditing ? (
                            <>
                                <div className="form-group">
                                    <label>Статус:</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="Новая заявка">Новая заявка</option>
                                        <option value="В процессе ремонта">В процессе ремонта</option>
                                        <option value="Готова к выдаче">Готова к выдаче</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Запчасти:</label>
                                    <textarea
                                        value={repairParts}
                                        onChange={(e) => setRepairParts(e.target.value)}
                                        rows="3"
                                    />
                                </div>
                                <div className="action-buttons">
                                    <button onClick={handleUpdateRequest} className="save-btn">
                                        Сохранить
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="cancel-btn">
                                        Отмена
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p><strong>Статус:</strong> 
                                    <span className={`status-badge ${getStatusClass(request.requeststatus)}`}>
                                        {request.requeststatus}
                                    </span>
                                </p>
                                {request.repairparts && (
                                    <p><strong>Запчасти:</strong> {request.repairparts}</p>
                                )}
                                {request.completiondate && (
                                    <p><strong>Дата завершения:</strong> {new Date(request.completiondate).toLocaleDateString('ru-RU')}</p>
                                )}
                                {request.masterid && (
                                    <p><strong>Мастер:</strong> #{request.masterid}</p>
                                )}
                                {canEdit && (
                                    <button onClick={() => setIsEditing(true)} className="edit-btn">
                                        Редактировать
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="comments-section">
                    <h2>Комментарии ({comments.length})</h2>
                    
                    {canComment && (
                        <form onSubmit={handleAddComment} className="comment-form">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Добавить комментарий..."
                                rows="3"
                                required
                            />
                            <button type="submit">Отправить</button>
                        </form>
                    )}

                    <div className="comments-list">
                        {comments.map(comment => (
                            <div key={comment.commentid} className="comment">
                                <div className="comment-header">
                                    <strong>Мастер #{comment.masterid}</strong>
                                    <small>ID: {comment.commentid}</small>
                                </div>
                                <p>{comment.message}</p>
                            </div>
                        ))}
                    </div>
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