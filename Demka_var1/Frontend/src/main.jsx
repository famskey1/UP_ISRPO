import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import LoginPage from './Pages/LoginPage';
import ProfilePage from './Pages/ProfilePage';
import RequestPage from './Pages/RequestsPage';
import RequestDetailPage from './Pages/RequestDetailPage';
import RegisterPage from './Pages/RegisterPage';
import App from './App'
import MyRequestsPage from './Pages/MyRequestsPage';
import CreateRequestPage from './Pages/CreateRequestPage';
import EditRequestPage from './Pages/EditRequestPage';
import './index.css';

const router = createBrowserRouter([
     {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            { path: "/profile/:id", element: <ProfilePage /> },
            { path: "/requests", element: <RequestPage /> },
            { path: "/my-requests/:id", element: <MyRequestsPage /> },
            { path: "/requests/:id", element: <RequestDetailPage /> },
            { path: "/create-request", element: <CreateRequestPage /> },
            { path: "/edit-request/:id", element: <EditRequestPage /> },
        ]
    }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
