import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from './pages/login_page';
import SignupPage from './pages/signup_page';
import DashboardPage from './pages/dashboard_page';
import ForgotPasswordPage from './pages/forgot_password_page'; // You will create this
import ResetPasswordPage from './pages/reset_password_page';   // You will create this
import MainLayout from './components/core/main_layout';
import ProfilePage from './pages/profile_page';
import { useEffect } from 'react';
import { get_profile } from './store/slices/auth_slice';
import SettingsPage from './pages/settings_page';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(get_profile());
    }
  }, [dispatch, token])

  return (
    <Router>
      <Routes>
        <Route element={token ? <MainLayout /> : <Navigate to="/login" />}>

          {/* If user is at http://localhost:5173/ */}
          <Route
            path="/"
            element={<DashboardPage />}
          />
          <Route
            path="/Profile"
            element={<ProfilePage />}
          />
          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Route>

        <Route
          path="/login"
          element={!token ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!token ? <SignupPage /> : <Navigate to="/" />}
        />

        {/* FORGOT PASSWORD ROUTE */}
        <Route
          path="/forgot-password"
          element={!token ? <ForgotPasswordPage /> : <Navigate to="/" />}
        />

        {/* RESET PASSWORD ROUTE (With dynamic token parameter) */}
        <Route
          path="/reset-password/:token"
          element={!token ? <ResetPasswordPage /> : <Navigate to="/" />}
        />

        {/* Redirect any other URL back to the root / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;