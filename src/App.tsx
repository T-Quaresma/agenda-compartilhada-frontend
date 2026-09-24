import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage"
import ActivityPage from "./pages/ActivityPage/ActivityPage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage/registerPage";




function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#BCE0F3]">
        <Routes> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainPage/>
            </ProtectedRoute>}/>
          <Route path="/activity/:id" element={
            <ProtectedRoute>
              <ActivityPage />
            </ProtectedRoute>} />
          <Route path="/schedule/:id" element={
            <ProtectedRoute>
              <SchedulePage />
            </ProtectedRoute>} />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App