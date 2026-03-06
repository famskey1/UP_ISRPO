import React, { useState } from 'react';
import '../css/CommentForm.css';

const CommentForm = ({ onSubmit, loading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        
        onSubmit(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напишите комментарий..."
                rows="3"
                disabled={loading}
            />
            <button type="submit" disabled={loading || !text.trim()}>
                {loading ? 'Отправка...' : 'Отправить'}
            </button>
        </form>
    );
};

export default CommentForm;