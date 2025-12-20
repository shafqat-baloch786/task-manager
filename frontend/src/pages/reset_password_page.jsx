import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UIInput } from '../components/ui_input';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle_submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`http://localhost:4000/api/auth/reset-password/${token}`, { password });
      alert("Password updated! Redirecting to login...");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Token invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">New Password</h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handle_submit}>
          <UIInput 
            label="Enter New Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4 shadow-md disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;