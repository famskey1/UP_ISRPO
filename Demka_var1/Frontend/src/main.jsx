import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
const router = createBrowserRouter([
  {
    errorElement: <ErrorPage/>,
    children: [{
      path: "",
      element: <App/>
    },
    {
      path: "/authorization",
      element: <Autorisation/>
    },
  
  ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
