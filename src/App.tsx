import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage"
import ActivityPage from "./pages/ActivityPage/ActivityPage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";




function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#BCE0F3]">
        <Routes> 
          <Route path="/" element={<MainPage />} />
          <Route path="/activity/:id" element={<ActivityPage />} />
          <Route path="/schedule/:id" element={<SchedulePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App