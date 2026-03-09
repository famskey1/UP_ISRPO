import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UsersAPI } from '../../API/UsersAPI';
import { getTokenData, hasRole } from '../../API/TokenUtils';
import '../css/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = getTokenData();

    const handleLogout = () => {
        UsersAPI.logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Сервисный центр
                </Link>
                
                <div className="nav-links">
                    {user.type == `Заказчик` ? (
                        <Link to={`/my-requests/${user.userid}`} className="nav-link">
                            Мои заявки
                        </Link>
                    ) : (
                        <Link to="/requests" className="nav-link">
                            Все заявки
                        </Link>
                    )}
                    {hasRole('Админ') && (
                        <Link to="/users" className="nav-link">
                            Пользователи
                        </Link>
                    )}
                    <Link to={`/profile/${user.userid}`} className="nav-link">
                        Профиль
                    </Link>
                    
                    <button onClick={handleLogout} className="nav-link logout-btn">
                        Выйти
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;