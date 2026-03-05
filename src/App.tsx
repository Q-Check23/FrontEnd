import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'

import Landing from "./pages/Landing/Landing";
import Login_Landing from "./pages/Landing/Login-Landing";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import CreateEvent from "./pages/CreateEvent/CreateEvent";

import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import FormBuilder from "./pages/FormBuilder/FormBuilder";
import EventParticipants from "./pages/Participants/EventParticipants";
import DashBoard from "./pages/DashBoard/DashBoard";
import QRInfo from "./pages/QRInfo/QRInfo";
import EventInfo from "./pages/EventInfo/EventInfo";
import QRCheckIn from "./pages/QRCheckIn/QRCheckIn";
import ParticipantRegister from "./components/ParticipantRegister";
import EventManage from "./pages/EventManage/EventManage";
import EventAnalysis from "./pages/EventAnalysis/EventAnalysis";

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
              <Route path="/event-creating" element={<CreateEvent/>}></Route>
              <Route path="/form-building" element={<FormBuilder/>}></Route>
              <Route path="/participants" element={<EventParticipants/>}></Route>
              <Route path="/dashboard" element={<DashBoard/>}></Route>
              <Route path="/qr-info" element={<QRInfo/>}></Route>
              <Route path="/event-info" element={<EventInfo/>}></Route>
              <Route path="/qr-checkin" element={<QRCheckIn/>}></Route>
              <Route path="/qr-checkin" element={<QRCheckIn/>}></Route>
              <Route path="/event-manage" element={<EventManage/>}></Route>
              <Route path="/event-analysis" element={<EventAnalysis/>}></Route>
              

            </Routes>

          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}