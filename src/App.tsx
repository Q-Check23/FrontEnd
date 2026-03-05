import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"

import Landing from "./pages/Landing/Landing"
import Login_Landing from "./pages/Landing/Login-Landing"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import Meeting from "./pages/Meeting/Meeting"
import Profile from "./pages/Profile/Profile"

import Layout from "./components/Layout"

import { ThemeProvider } from "./context/ThemeContext"
import { ToastProvider } from "./context/ToastContext"

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="App">

            <Routes>

              {/* BottomBar 없는 페이지 */}
              <Route path="/" element={<Landing />} />
              <Route path="/login-landing" element={<Login_Landing />} />
              <Route path="/login" element={<Login />} />

              {/* BottomBar 있는 페이지 */}
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/meeting" element={<Meeting />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

            </Routes>

          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}