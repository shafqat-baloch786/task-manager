import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/signuppage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

import MainLayout from "./components/core/mainLayout";
import { getProfile } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Routes>
        <Route element={token ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="/login"
          element={!token ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!token ? <SignupPage /> : <Navigate to="/" />}
        />

        <Route
          path="/forgot-password"
          element={!token ? <ForgotPasswordPage /> : <Navigate to="/" />}
        />

        <Route
          path="/reset-password/:token"
          element={!token ? <ResetPasswordPage /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
