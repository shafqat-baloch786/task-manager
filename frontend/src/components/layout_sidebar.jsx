import { useDispatch, useSelector } from 'react-redux';
import { logout_user } from '../store/slices/auth_slice';
import { LayoutDashboard, CheckCircle, LogOut, User as UserIcon } from 'lucide-react';

export const LayoutSidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <CheckCircle className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 p-3 rounded-xl cursor-pointer">
          <LayoutDashboard size={20} />
          <span className="font-semibold">Dashboard</span>
        </div>
        {/* Add more nav items here */}
      </nav>

      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-indigo-600 font-bold">
            {user?.name?.charAt(0) || <UserIcon size={18} />}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button 
          onClick={() => dispatch(logout_user())}
          className="flex items-center gap-3 w-full p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};