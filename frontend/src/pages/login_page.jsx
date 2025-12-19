import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login_user, reset_auth_state } from '../store/slices/auth_slice';
import { UIInput } from '../components/ui_input';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { is_loading, error, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Reset errors when entering page
  useEffect(() => {
    dispatch(reset_auth_state());
  }, [dispatch]);

  // If token appears in state, move to dashboard
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handle_submit = (e) => {
    e.preventDefault();
    dispatch(login_user(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>
        
        {/* ERROR MESSAGE FROM BACKEND */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handle_submit}>
          <UIInput 
            label="Email Address" 
            type="email" 
            name="email" 
            placeholder="name@company.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <UIInput 
            label="Password" 
            type="password" 
            name="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          
          <button
            type="submit"
            disabled={is_loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4 shadow-md disabled:opacity-70"
          >
            {is_loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;