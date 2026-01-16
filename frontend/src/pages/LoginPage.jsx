import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "../store/slices/authSlice";
import { UIInput } from "../components/uiInput";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { isLoading, error, successMessage, token } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit}>
          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm border border-green-100 flex items-center">
              <span className="mr-2">✓</span> {successMessage}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100 flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <UIInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <div>
            <UIInput
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <div className="flex justify-end -mt-3 mb-4">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2 shadow-md disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
