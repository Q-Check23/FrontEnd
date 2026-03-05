import { createBrowserRouter } from "react-router-dom"
import Layout from "../components/Layout"
import Home from "../pages/Home/Home"
import Landing from "../pages/Landing/Landing"
import Login from "../pages/Login/Login"

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/landing",
        element: <Landing />
      },
      {
        path: "/login",
        element: <Login />
      }
    ]
  }
])