import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import { CommentsAPI } from '../../API/CommentsAPI';
import { UsersAPI } from '../../API/UsersAPI';
import { hasRole, getTokenData} from '../../API/TokenUtils';
import '../css/RequestDetailPage.css';

const RequestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sendingComment, setSendingComment] = useState(false);
    const [commentText, setCommentText] = useState('');
	const [repairParts, setRepairParts] = useState('');
	const [status, setStatus] = useState('');
	const [isEditing, setIsEditing] = useState(false);
    const [masterId, setMasterId] = useState('');
    const [masters, setMasters] = useState([]);
    const [completionDate, setCompletionDate] = useState('');
    const [clientInfo, setClientInfo] = useState(null);
    const [masterInfo, setMasterInfo] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
	const [editCommentText, setEditCommentText] = useState('');
    
    const user = getTokenData();
    useEffect(() => {
        loadData();
        loadMasters();
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
            setMasterId(requestData.masterid || '');
            setCompletionDate(requestData.completiondate ? requestData.completiondate.split('T')[0] : '');
            const requestComments = commentsData.filter(c => c.requestid == id);
            setComments(requestComments);
            
            if (requestData.clientid) {
                try {
                    const client = await UsersAPI.getOne(requestData.clientid);
                    setClientInfo(client);
                } catch (err) {
                    console.error('Ошибка загрузки клиента:', err);
                }
            }
            
            if (requestData.masterid) {
                try {
                    const master = await UsersAPI.getOne(requestData.masterid);
                    setMasterInfo(master);
                } catch (err) {
                    console.error('Ошибка загрузки мастера:', err);
                }
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const loadMasters = async () => {
        try {
            const allUsers = await UsersAPI.getAll();
            const mastersList = allUsers.filter(u => u.type === 'Мастер');
            setMasters(mastersList);
        } catch (err) {
            console.error('Ошибка загрузки мастеров:', err);
        }
    };
    
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setSendingComment(true);

        try {
            const commentData = {
            message: commentText.trim(),
            masterid: user?.userid,
            requestid: parseInt(id)
        };
            await CommentsAPI.create(commentData);
            setCommentText('');
            await loadData();
        } catch (err) {
            alert(err.message);
        } finally {
            setSendingComment(false);
        }
    };

    const startEditComment = (comment) => {
        setEditingCommentId(comment.commentid);
        setEditCommentText(comment.message);
    }

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditCommentText('');
    }

    const handleEditComment = async (commentId) => {
        if (!editCommentText.trim()) return;
        
        try {
            const commentData = {
                message: editCommentText.trim(),
                commentid: parseInt(id),
                masterid: user?.userid,
                requestid: request?.requestid
            }

            await CommentsAPI.update(commentId, commentData);
            setEditingCommentId(null);
            setEditCommentText('');
            await loadData();
            alert('Комментарий обновлен');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Удалить комментарий?')) return;
        
        try {
            await CommentsAPI.delete(commentId);
            await loadData();
            alert('Комментарий удален');
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };
    
    const handleUpdateRequest = async () => {
        try {
             const updateData = {
                requeststatus: status,
                repairparts: repairParts,
                hometechtype:request.hometechtype,
                hometechmodel:request.hometechmodel,
                problemdescryption:request.problemdescryption,
                masterid: masterId ? parseInt(masterId) : null,
                completiondate: completionDate || null,
                clientid: request.clientid
            };
            await RequestsAPI.update(id, updateData);
            setIsEditing(false);
            await loadData();
            alert('Заявка успешно обновлена!');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteRequest = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить заявку?')) return;
        
        try {
            await RequestsAPI.delete(id);
            alert('Заявка удалена');
            navigate(-1);
        } catch (err) {
            alert(err.message);
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

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!request) return <div className="error">Заявка не найдена</div>;
    
    const isOwner = request.clientid === user?.userid;
    const isMaster = hasRole('Мастер');
    const isAdmin = hasRole('Админ');
    const isManager = hasRole('Менеджер') || hasRole('Оператор');
    
    const canEdit = isAdmin || isMaster || isManager;
    const canComment = isMaster || isOwner || isManager || isOwner;
    const canDelete = isAdmin;
    const canAssignMaster = !isOwner;

    return (
        <div className="detail-page">
            <button onClick={() => navigate(-1)} className="back-btn">
                Назад к списку
            </button>
            <div className="request-detail">
                <div className="detail-header">
                    <h1>Заявка №{request.requestid}</h1>
                    <div className="header-actions">
                        
                        {canEdit && !isEditing && (
                            <button onClick={() => navigate(`/edit-request/${id}`)} className="edit-btn">
                                Редактировать
                                </button>	
                            )}
                        {canDelete && (
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
                        request.startdate
                        ? new Date(request.startdate).toLocaleDateString('ru-RU'): 'Не указана'
                        }</p>
                        <div className="client-info">
                            <p><strong>Заказчик:</strong> #{request.clientid}</p>
                            {clientInfo ? (
                                <>
                                    <p><strong>ФИО:</strong> {clientInfo.fio}</p>
                                    <p><strong>Телефон:</strong> {clientInfo.phone || 'Не указан'}</p>
                                </>
                            ) : (
                                <p className="loading-text">Загрузка данных заказчика...</p>
                            )}
                        </div>
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
                                {canAssignMaster && (
                                    <div className="form-group">
                                        <label>Назначить мастера:</label>
                                        <select 
                                            value={masterId} 
                                            onChange={(e) => setMasterId(e.target.value)}
                                        >
                                            <option value="">Не назначен</option>
                                            {masters.map(master => (
                                                <option key={master.userid} value={master.userid}>
                                                    {master.fio} (ID: {master.userid})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Дата завершения:</label>
                                    <input
                                        type="date"
                                        value={completionDate}
                                        onChange={(e) => setCompletionDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Использованные запчасти:</label>
                                    <textarea
                                        value={repairParts}
                                        onChange={(e) => setRepairParts(e.target.value)}
                                        rows="3"
                                        placeholder="Укажите использованные запчасти"
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
                                
                                <div className="master-info">
                                    <h4>Ответственный мастер</h4>
                                    {request.masterid ? (
                                        masterInfo ? (
                                            <>
                                                <p><strong>ID:</strong> #{request.masterid}</p>
                                                <p><strong>ФИО:</strong> {masterInfo.fio}</p>
                                                <p><strong>Телефон:</strong> {masterInfo.phone || 'Не указан'}</p>
                                            </>
                                        ) : (
                                            <p>ID мастера: #{request.masterid}</p>
                                        )
                                    ) : (
                                        <p>Не назначен</p>
                                    )}
                                </div>

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
                                placeholder={isOwner ? "Добавить комментарий к своей заявке..." : "Добавить комментарий..."}
                                rows="3"
                                required
                                disabled={sendingComment}
                            />
                            <button type="submit" disabled={sendingComment}>
                                {sendingComment ? 'Отправка...' : 'Отправить'}
                            </button>
                        </form>
                    )}

                    <div className="comments-list">
                        {comments.map(comment =>{
                            const isCommentAuthor = comment.masterid === user?.userid;
                            const canEditComment = isAdmin || isCommentAuthor;
                            return(
                                <div key={comment.commentid} className="comment">
                                    {editingCommentId === comment.commentid ?(
                                        <div className="comment-edit-form">
                                            <textarea
                                                value={editCommentText}
                                                onChange={(e) => setEditCommentText(e.target.value)}
                                                rows="3"
                                            />
                                            <div className="comment-edit-actions">
                                                <button onClick={() => handleEditComment(comment.commentid)}>
                                                    Сохранить
                                                </button>
                                                <button onClick={cancelEditComment}>
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ):(
                                        <>
                                        <div className="comment-header">
                                                <strong>Пользователь #{comment.masterid}</strong>
                                                <small>ID: {comment.commentid}</small>
                                                {canEditComment && (
                                                    <div className="comment-actions">
                                                        <button 
                                                            onClick={() => startEditComment(comment)}
                                                            className="edit-comment-btn"
                                                        >
                                                            редактировать
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteComment(comment.commentid)}
                                                            className="delete-comment-btn"
                                                        >
                                                            удалить
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                        <p>{comment.message}</p>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailPage;