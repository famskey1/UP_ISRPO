import React, { useState } from 'react';
import { UsersAPI } from '../../API/UsersAPI';
import '../css/LoginPage.css';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
const LoginPage = () => {
    const { handleLogin } = useOutletContext();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await UsersAPI.login(login, password);
            handleLogin();
        } catch (err) {
            setError(err.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Сервисный центр</h1>
                <h2>Вход в систему</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Введите логин"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p>Нет аккаунта?{' '}
                        <Link to="/register" style={{ color: 'blueviolet' }}>Зарегистрироваться</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;

