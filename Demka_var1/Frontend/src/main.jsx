import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import LoginPage from './Pages/LoginPage';
import ProfilePage from './Pages/ProfilePage';
import RequestPage from './Pages/RequestsPage';
import RequestDetailPage from './Pages/RequestDetailPage';
import App from './App'
import MyRequestsPage from './Pages/MyRequestsPage';
import './index.css';

const router = createBrowserRouter([
     {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <LoginPage /> },
            { path: "/profile/:id", element: <ProfilePage /> },
            { path: "/requests", element: <RequestPage /> },
            { path: "/my-requests/:id", element: <MyRequestsPage /> },
            { path: "/requests/:id", element: <RequestDetailPage /> },
        ]
    }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
