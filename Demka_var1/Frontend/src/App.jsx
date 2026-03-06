import { useState, useEffect } from 'react';
import { getTokenData, isAuthenticated } from '../API/TokenUtils';
import Navbar from './Default/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';

const App = () => {
    const [auth, setAuth] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {
        setAuth(isAuthenticated());
    }, []);

    const handleLogin = () => {
        setAuth(true);
        const user = getTokenData();
        if (user?.type === "Заказчик") {
            navigate(`/my-requests/${user.userid}`);
        } else {
            navigate('/requests');
        }
    };

    return (
        <>
            {auth && <Navbar />}
            <Outlet context={{ handleLogin }} />
        </>
    );
};

export default App;