import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UsersAPI } from '../../API/UsersAPI';
import '../css/LoginPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fio: '',
        phone: '',
        login: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.fio.trim()) return 'Введите ФИО';
        if (!formData.phone.trim()) return 'Введите телефон';
        
        const phoneRegex = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        return 'Введите корректный номер телефона';
    }
        if (!formData.login.trim()) return 'Введите логин';
        if (!formData.password) return 'Введите пароль';
        if (formData.password.length < 6) return 'Пароль должен быть не менее 6 символов';
        if (formData.password !== formData.confirmPassword) return 'Пароли не совпадают';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);
        
        try {
            const userData = {
            fio: formData.fio,
            phone: formData.phone,
            login: formData.login,
            password: formData.password,
            type: 'Заказчик'
        }

        await UsersAPI.create(userData); 
        setSuccess(true);
            
            try {
                const loginResponse = await UsersAPI.login(formData.login, formData.password);
                const tokenData = getTokenData();
                const userId = tokenData?.userid || loginResponse?.userid;
                if (userId) {
                    window.location.href = `/my-requests/${userId}`;
                } else {
                    window.location.href = '/my-requests';
                }
            } catch (loginErr) {
                console.warn('Автоматический вход не удался:', loginErr);
                setTimeout(() => navigate('/'), 3000);
            }
        } catch (err) {
            setError(err.message || 'Ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h1>Сервисный центр</h1>
                    <div className="success-message">
                        <h2>Регистрация успешна!</h2>
                        <p>Сейчас вы будете перенаправлены на страницу входа...</p>
                        <Link to="/" className="btn-link">
                            Перейти на страницу входа
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '500px' }}>
                <h1>Сервисный центр</h1>
                <h2>Регистрация</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ФИО *</label>
                        <input
                            type="text"
                            name="fio"
                            value={formData.fio}
                            onChange={handleInputChange}
                            placeholder="Иванов Иван Иванович"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Телефон *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+7 (999) 123-45-67"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Логин *</label>
                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleInputChange}
                            placeholder="Придумайте логин"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Пароль *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Не менее 6 символов"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Подтверждение пароля *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Повторите пароль"
                            required
                        />
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                
                <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p>
                        Уже есть аккаунт?{' '}
                        <Link to="/" style={{ color: "blueviolet" }}>
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;