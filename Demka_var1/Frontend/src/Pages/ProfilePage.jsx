import React, { useState, useEffect } from 'react';
import { UsersAPI } from '../../API/UsersAPI';
import { getCurrentUserId, getCurrentUserRole } from '../../API/TokenUtils';
import '../css/ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fio: '',
        phone: '',
        login: '',
        password: ''
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userId = getCurrentUserId();
            const userData = await UsersAPI.getOne(userId);
            setUser(userData);
            setFormData({
                fio: userData.fio || '',
                phone: userData.phone || '',
                login: userData.login || '',
                password: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('fio', formData.fio);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('login', formData.login);
            if (formData.password) {
                formDataToSend.append('password', formData.password);
            }

            await UsersAPI.update(user.userid, formDataToSend);
            setIsEditing(false);
            loadUserData();
            alert('Профиль успешно обновлен!');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return <div className="error">Пользователь не найден</div>;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.fio ? user.fio.charAt(0) : '?'}
                    </div>
                    <div className="profile-title">
                        <h1>Мой профиль</h1>
                        <span className="profile-role">{user.type}</span>
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label>ФИО</label>
                            <input
                                type="text"
                                name="fio"
                                value={formData.fio}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Телефон</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Логин</label>
                            <input
                                type="text"
                                name="login"
                                value={formData.login}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Новый пароль (оставьте пустым, если не хотите менять)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Введите новый пароль"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">Сохранить</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                                Отмена
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="info-label">ФИО:</span>
                            <span className="info-value">{user.fio}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Телефон:</span>
                            <span className="info-value">{user.phone}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Логин:</span>
                            <span className="info-value">{user.login}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Роль:</span>
                            <span className="info-value role-badge">{user.type}</span>
                        </div>
                        
                        <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                            Редактировать профиль
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;