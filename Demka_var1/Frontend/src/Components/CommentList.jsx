import React from 'react';
import CommentItem from './CommentItem';
import '../css/CommentList.css';

const CommentList = ({ comments, onEditComment, onDeleteComment }) => {
    if (!comments || comments.length === 0) {
        return (
            <div className="no-comments">
                <p>Комментариев пока нет</p>
            </div>
        );
    }

    return (
        <div className="comment-list">
            {comments.map(comment => (
                <CommentItem
                    key={comment.commentid}
                    comment={comment}
                    onEdit={onEditComment}
                    onDelete={onDeleteComment}
                />
            ))}
        </div>
    );
};

export default CommentList;