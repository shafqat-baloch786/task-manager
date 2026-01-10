import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_profile, logout_user, update_profile, reset_auth_state } from '../store/slices/auth_slice';
import { fetch_tasks, add_task, update_task, clear_task_error, bulk_delete_tasks } from '../store/slices/task_slice';
import {
  LayoutDashboard, LogOut, User, ClipboardList,
  CheckCircle2, Settings, X, AlertCircle
} from 'lucide-react';
import ProfileView from '../components/profile_view';
import DashboardView from '../components/views/dashboard_view';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, token, error: authError, success_msg } = useSelector((state) => state.auth);
  const { items, is_loading, error: taskError } = useSelector((state) => state.tasks);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [taskData, setTaskData] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', status: 'pending'
  });
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isCompletedOnly, setIsCompletedOnly] = useState(true);


  useEffect(() => {
    if (token) {
      dispatch(get_profile());
      dispatch(fetch_tasks());
    }
  }, [dispatch, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedTasks([]);
  }, [activeTab])

  const openEditModal = (task) => {
    dispatch(clear_task_error());
    setEditId(task._id);
    setTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    dispatch(clear_task_error());
    setShowModal(false);
    setEditId(null);
    setTaskData({ title: '', description: '', priority: 'medium', dueDate: '', status: 'pending' });
  };

  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) return;

    dispatch(bulk_delete_tasks(selectedTasks)).then((res) => {
      if (!res.error) {
        setSelectedTasks([]);
      }
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(update_task({ id: editId, updates: taskData })).then((res) => {
        if (!res.error) handleCloseModal();
      });
    } else {
      dispatch(add_task(taskData)).then((res) => {
        if (!res.error) handleCloseModal();
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    if (e) e.preventDefault();
    const result = await dispatch(update_profile(profileData));

    if (update_profile.fulfilled.match(result)) {
      setTimeout(() => {
        setShowProfileModal(false);
        dispatch(reset_auth_state());
      }, 2500);
    }
  };

  const openProfileEdit = () => {
    dispatch(reset_auth_state());
    setProfileData({ name: user.name, email: user.email });
    setShowProfileModal(true);
  };

  // Only show loading screen if we have no user AND we are actually loading from server
  if (!user && is_loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  // Safety check to ensure we don't map over empty items
  if (!user) return null;

  const filteredTasks = items?.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) && (isCompletedOnly ? t.isCompleted : true)) || [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <ClipboardList size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">TaskFlow</span>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black transition-all ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
              <User size={20} /> My Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-2xl font-bold transition-all">
              <Settings size={20} /> Settings
            </button>
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-slate-100">
          <button onClick={() => dispatch(logout_user())} className="w-full flex items-center gap-3 px-4 py-4 text-rose-600 hover:bg-rose-50 rounded-2xl font-black transition-all active:scale-95">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-12">
        {activeTab === 'dashboard' ? (
          <DashboardView user={user} is_loading={is_loading} setIsCompletedOnly={setIsCompletedOnly} isCompletedOnly={isCompletedOnly} items={items} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setShowModal={setShowModal} selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} handleBulkDelete={handleBulkDelete} openEditModal={openEditModal} activeTaskId={activeTaskId} setActiveTaskId={setActiveTaskId} filteredTasks={filteredTasks} />
        ) :
          (
            <ProfileView user={user} taskCount={items.length} onEditClick={openProfileEdit} />
          )}
      </main>

      {/* TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{editId ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={handleCloseModal} className="p-4 hover:bg-white rounded-[24px] text-slate-300 hover:text-rose-500 transition-all active:scale-90"><X size={28} strokeWidth={3} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {taskError && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl">
                  <AlertCircle size={20} /> <p className="text-sm font-bold">{taskError}</p>
                </div>
              )}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Task Title</label>
                <input required placeholder="What needs to be done?" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-lg" type="text" value={taskData.title} onChange={e => setTaskData({ ...taskData, title: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Description</label>
                <textarea placeholder="Add details..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none h-36 font-medium text-slate-700 resize-none" value={taskData.description} onChange={e => setTaskData({ ...taskData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Priority</label>
                  <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700 appearance-none" value={taskData.priority} onChange={e => setTaskData({ ...taskData, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Deadline</label>
                  <input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700" type="date" value={taskData.dueDate} onChange={e => setTaskData({ ...taskData, dueDate: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black hover:bg-indigo-700 transition-all shadow-2xl active:scale-[0.98] text-xl mt-4">
                {editId ? 'Save Changes' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Edit Account</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-4 hover:bg-white rounded-[24px] text-slate-300 hover:text-rose-500 transition-all active:scale-90"><X size={28} strokeWidth={3} /></button>
            </div>

            {/* CHANGED FROM <form> TO <div> TO PREVENT ANY POSSIBLE RELOAD */}
            <div className="p-10 space-y-8">

              {/* SUCCESS MESSAGE */}
              {success_msg && (
                <div className="flex items-center gap-3 p-5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-[24px] animate-in slide-in-from-top-4 duration-300">
                  <CheckCircle2 size={22} strokeWidth={3} />
                  <p className="font-black text-sm tracking-tight">{success_msg}</p>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {authError && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl">
                  <AlertCircle size={20} /> <p className="text-sm font-bold">{authError}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-lg" type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-lg" type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} />
              </div>

              <button
                type="button"
                onClick={handleProfileSubmit}
                className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black hover:bg-indigo-600 transition-all shadow-2xl active:scale-[0.98] text-xl mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;