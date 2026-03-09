import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UsersAPI } from '../../API/UsersAPI';
import { hasRole, getTokenData } from '../../API/TokenUtils';
import '../css/UsersListPage.css';

const UsersListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({
        fio: '',
        phone: '',
        login: '',
        password: '',
        type: ''
    });
    const currentUser = getTokenData();

    const roleOptions = [
        'Админ',
        'Менеджер',
        'Мастер',
        'Оператор',
        'Заказчик'
    ];

    useEffect(() => {
        if (!hasRole('Админ')) {
            setError('Доступ запрещен');
            setLoading(false);
            return;
        }
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await UsersAPI.getAll();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Удалить пользователя?')) return;
        
        try {
            await UsersAPI.delete(userId);
            loadUsers();
            alert('Пользователь удален');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const userToUpdate = users.find(u => u.userid === userId);
            
            const userData = {
                fio: userToUpdate.fio,
                phone: userToUpdate.phone,
                login: userToUpdate.login,
                password: userToUpdate.password,
                type: newRole
            };

            await UsersAPI.update(userId, userData);
            setEditingUser(null);
            loadUsers();
            alert('Роль пользователя обновлена');
        } catch (err) {
            alert(err.message || 'Ошибка при обновлении роли');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        
        try {
            await UsersAPI.create(newUser);
            setShowCreateForm(false);
            setNewUser({
                fio: '',
                phone: '',
                login: '',
                password: '',
                type: 'Заказчик'
            });
            loadUsers();
            alert('Пользователь создан');
        } catch (err) {
            alert(err.message);
        }
    };

    const getRoleClass = (role) => {
        switch (role) {
            case 'Админ': return 'role-admin';
            case 'Менеджер': return 'role-manager';
            case 'Мастер': return 'role-master';
            case 'Оператор': return 'role-operator';
            default: return 'role-client';
        }
    };

    if (!hasRole('Админ')) {
        return <div className="error">Доступ запрещен. Только для администратора.</div>;
    }

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="users-page">
            <div className="page-header">
                <h1>Управление пользователями</h1>
                <button 
                    className="btn-create"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Отмена' : '+ Новый пользователь'}
                </button>
            </div>

            {showCreateForm && (
                <div className="create-user-form">
                    <h2>Создание нового пользователя</h2>
                    <form onSubmit={handleCreateUser}>
                        <div className="form-group">
                            <label>ФИО</label>
                            <input
                                type="text"
                                value={newUser.fio}
                                onChange={(e) => setNewUser({...newUser, fio: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Телефон</label>
                            <input
                                type="tel"
                                value={newUser.phone}
                                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Логин</label>
                            <input
                                type="text"
                                value={newUser.login}
                                onChange={(e) => setNewUser({...newUser, login: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Пароль</label>
                            <input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Роль</label>
                            <select
                                value={newUser.type}
                                onChange={(e) => setNewUser({...newUser, type: e.target.value})}
                            >
                                {roleOptions.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button type="submit" className="submit-btn">Создать</button>
                    </form>
                </div>
            )}

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ФИО</th>
                            <th>Телефон</th>
                            <th>Логин</th>
                            <th>Роль</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userid}>
                                <td>{user.userid}</td>
                                <td>{user.fio}</td>
                                <td>{user.phone}</td>
                                <td>{user.login}</td>
                                <td>
                                    {editingUser === user.userid ? (
                                        <select
                                            value={user.type}
                                            onChange={(e) => handleRoleChange(user.userid, e.target.value)}
                                            onBlur={() => setEditingUser(null)}
                                            autoFocus
                                        >
                                            {roleOptions.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span 
                                            className={`role-badge ${getRoleClass(user.type)}`}
                                            onDoubleClick={() => setEditingUser(user.userid)}
                                            style={{ cursor: 'pointer' }}
                                            title="Двойной клик для редактирования"
                                        >
                                            {user.type}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(user.userid)}
                                        disabled={user.userid === currentUser?.userid}
                                        title={user.userid === currentUser?.userid ? "Нельзя удалить себя" : "Удалить пользователя"}
                                    >
                                        удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersListPage;