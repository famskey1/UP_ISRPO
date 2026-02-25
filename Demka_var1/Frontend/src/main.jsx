import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import CommentsPage from './Pages/CommentsPage.jsx'
import UserPage from './Pages/UserPage.jsx'
import RequestsPage from './Pages/RequestsPage.jsx'
import AuthorizationApp from './AuthorizationApp.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage/>,
    children: [{
      path: "",
      element: <AuthorizationApp/>
    },
    {
      path: "/user/{id}",
      element: <UserPage/>
    },
    {
      path: "/requests/{id}/comments",
      element: <CommentsPage/>
    },
    {
      path: "/requests",
      element: <RequestsPage/>
    },
  ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
