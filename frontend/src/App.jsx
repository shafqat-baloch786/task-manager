import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/login_page';
import SignupPage from './pages/signup_page';
import DashboardPage from './pages/dashboard_page';

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* If user is at http://localhost:5173/ */}
        <Route 
          path="/" 
          element={token ? <DashboardPage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/login" 
          element={!token ? <LoginPage /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/register" 
          element={!token ? <SignupPage /> : <Navigate to="/" />} 
        />

        {/* Redirect any other URL (like /dashboard) back to the root / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;