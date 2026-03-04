import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'

import Landing from "./pages/Landing/Landing";
import Login_Landing from "./pages/Landing/Login-Landing";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Landing/>}></Route>
              <Route path="/login-landing" element={<Login_Landing/>}></Route>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/home" element={<Home/>}></Route>

            </Routes>

          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}