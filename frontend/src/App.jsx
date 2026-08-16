import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./component/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TicketListPage from "./pages/TicketListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import CreateTicketPage from "./pages/CreateTicketPage";

function App() {
  // Check karein ke user login hai ya nahi
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="App">
      {/* Navbar sirf tab dikhayein jab user authenticated ho */}
      {isAuthenticated && <Navbar />}
      
      <div style={{ padding: "20px" }}>
        <Routes>
          {/* Agar login page par hai aur user pehle se login hai, toh list page par bhej dein */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} 
          />
          
          {/* Protected Routes: Agar login nahi hai, toh /login par bhej dein */}
          <Route 
            path="/" 
            element={isAuthenticated ? <TicketListPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create" 
            element={isAuthenticated ? <CreateTicketPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tickets/:id" 
            element={isAuthenticated ? <TicketDetailPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;