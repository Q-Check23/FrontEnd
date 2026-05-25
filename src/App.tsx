import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "./lib/query-client"
import "./App.css"

import DashBoard from "./pages/DashBoard/DashBoard";
import QRInfo from "./pages/QRInfo/QRInfo";
import Landing from "./pages/Landing/Landing"
import Login_Landing from "./pages/Landing/Login-Landing"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import Meeting from "./pages/Meetings/Meetings"
import Profile from "./pages/Profile/ProfilePage"
import GroupNotice from "./pages/GroupNotice/GroupNotice";
import GroupEvents from "./pages/GroupEvents/GroupEvents";
import GroupMembers from "./pages/GroupMembers/GroupMembers";
import EventInfo from "./pages/EventInfo/EventInfo";
import QRCheckIn from "./pages/QRCheckIn/QRCheckIn";
import EventParticipants from "./pages/EventParticipants/EventParticipants";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import CreateClub from "./pages/CreateClub/CreateClub";
import EditEvent from "./pages/EditEvent/EditEvent";
import AuthCallback from "./pages/AuthCallback/AuthCallback";
import Register from "./pages/Register/Register";

import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import ToastContainer from "./components/ToastContainer"

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">

          <Routes>

            {/* 공개 라우트 */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/login-landing" element={<Login_Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/register" element={<Register />} />

            {/* 보호 라우트 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashBoard/>} />
              <Route path="/qr-info" element={<QRInfo/>} />
              <Route path="/group-notice" element={<GroupNotice />} />
              <Route path="/group-events" element={<GroupEvents />} />
              <Route path="/group-members" element={<GroupMembers />} />
              <Route path="/event-info" element={<EventInfo />} />
              <Route path="/qrcheck-in" element={<QRCheckIn />} />
              <Route path="/participants" element={<EventParticipants />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/create-club" element={<CreateClub />} />
              <Route path="/edit-event" element={<EditEvent />} />

              {/* BottomBar 있는 페이지 */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/meeting" element={<Meeting />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

          </Routes>

        </div>
      </Router>
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
