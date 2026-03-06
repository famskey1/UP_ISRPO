import React, { useState } from 'react';
import { hasRole, getTokenData } from '../../API/TokenUtils';
import '../css/CommentItem.css';

const CommentItem = ({ comment, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.message);
    const user = getTokenData();

    const handleEdit = () => {
        onEdit(comment.commentid, editText);
        setIsEditing(false);
    };

    const canEdit = hasRole('Админ') || comment.masterid === user?.userid;

    if (isEditing) {
        return (
            <div className="comment editing">
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="3"
                />
                <div className="comment-actions">
                    <button onClick={handleEdit} className="save-btn">Сохранить</button>
                    <button onClick={() => setIsEditing(false)} className="cancel-btn">Отмена</button>
                </div>
            </div>
        );
    }

    return (
        <div className="comment">
            <div className="comment-header">
                <strong>Мастер #{comment.masterid}</strong>
                <small>{new Date(comment.createdat).toLocaleString() || 'только что'}</small>
            </div>
            <p className="comment-text">{comment.message}</p>
            {canEdit && (
                <div className="comment-actions">
                    <button onClick={() => setIsEditing(true)} className="edit-btn">редакт.</button>
                    <button onClick={() => onDelete(comment.commentid)} className="delete-btn">удалить</button>
                </div>
            )}
        </div>
    );
};

export default CommentItem;