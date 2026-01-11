import { useDispatch } from 'react-redux';
import { logout_user } from '../../store/slices/auth_slice';
import { LayoutDashboard, LogOut, ClipboardList, User, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const paths = [
  {
    pathname: '/',
    title: 'Dashboard',
    icon: <LayoutDashboard size={20} />
  },
  {
    pathname: '/profile',
    title: 'Profile',
    icon: <User size={20} />
  },
  {
    pathname: '/settings',
    title: 'Settings',
    icon: <Settings size={20} />
  }
]

export const LayoutSidebar = () => {
  const dispatch = useDispatch();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <ClipboardList size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">TaskFlow</span>
        </div>
        <nav className="space-y-2">
          {paths.map((path) =>
            <NavLink key={path.title} to={path.pathname} className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black transition-all ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
              {path.icon} {path.title}
            </NavLink>
          )}
        </nav>
      </div>
      <div className="mt-auto p-8 border-t border-slate-100">
        <button onClick={() => dispatch(logout_user())} className="w-full flex items-center gap-3 px-4 py-4 text-rose-600 hover:bg-rose-50 rounded-2xl font-black transition-all active:scale-95">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};