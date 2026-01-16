import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetAuthState } from "../store/slices/authSlice";
import { UIInput } from "../components/uiInput";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isLoading, error, successMessage } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">
            Start managing your tasks effectively
          </p>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm">
              <p className="font-bold">{successMessage}</p>
              <p>
                Please{" "}
                <Link to="/login" className="underline font-bold">
                  click login
                </Link>{" "}
                to access your account.
              </p>
            </div>
          )}
        </div>

        {/* BACKEND ERROR */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-1">
            <UIInput
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />

            <UIInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <UIInput
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-6 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Get Started"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
