import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register_user, reset_auth_state } from '../store/slices/auth_slice';
import { UIInput } from '../components/ui_input';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { is_loading, error, success_msg } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Reset errors/messages when the component mounts
  useEffect(() => {
    dispatch(reset_auth_state());
  }, [dispatch]);

  const handle_submit = (e) => {
    e.preventDefault();
    // We removed the .then(navigate) to allow success message to show
    dispatch(register_user(formData));
  };

  const handle_change = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Start managing your tasks effectively</p>
          
          {/* SUCCESS MESSAGE DISPLAYED HERE */}
          {success_msg && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm">
              <p className="font-bold">{success_msg}</p>
              <p>Please <Link to="/login" className="underline font-bold">click login</Link> to login to your account.</p>
            </div>
          )}
        </div>
        
        {/* BACKEND ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Hide form on success to focus on the login link, or keep it visible */}
        {!success_msg && (
          <form onSubmit={handle_submit} className="space-y-1">
            <UIInput 
              label="Full Name" 
              type="text" 
              name="name" 
              placeholder="John Doe"
              value={formData.name}
              onChange={handle_change} 
            />
            <UIInput 
              label="Email Address" 
              type="email" 
              name="email" 
              placeholder="john@example.com"
              value={formData.email}
              onChange={handle_change} 
            />
            <UIInput 
              label="Password" 
              type="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handle_change} 
            />
            
            <button
              type="submit"
              disabled={is_loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-6 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {is_loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;