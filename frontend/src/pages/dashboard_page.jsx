import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_profile, logout_user } from '../store/slices/auth_slice';
import { fetch_tasks, add_task, remove_task, update_task, clear_task_error } from '../store/slices/task_slice';
import { 
  LayoutDashboard, LogOut, Plus, User, ClipboardList, 
  CheckCircle2, Clock, Search, Settings, X, Trash2, AlertCircle, Pencil
} from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  // Get error from tasks slice to show in modal
  const { items, is_loading, error: taskError } = useSelector((state) => state.tasks);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [taskData, setTaskData] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', status: 'pending'
  });

  useEffect(() => {
    if (token) {
      dispatch(get_profile());
      dispatch(fetch_tasks());
    }
  }, [dispatch, token]);

  const openEditModal = (task) => {
    dispatch(clear_task_error()); // Clear any old errors
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
    dispatch(clear_task_error()); // Clear errors on close
    setShowModal(false);
    setEditId(null);
    setTaskData({ title: '', description: '', priority: 'medium', dueDate: '', status: 'pending' });
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

  const toggleStatus = (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    dispatch(update_task({ id: task._id, updates: { status: newStatus } }));
  };

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = items?.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];

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
            <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-indigo-50 text-indigo-700 rounded-2xl font-black transition-all">
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-2xl font-bold transition-all">
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
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">Hello, {user.name.split(' ')[0]}!</h1>
              <p className="text-slate-500 text-lg font-medium">{items.length > 0 ? `Focus on your ${items.length} active tasks today.` : "Your workspace is ready for new ideas."}</p>
            </div>
            <button onClick={() => { dispatch(clear_task_error()); setShowModal(true); }} className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95">
              <Plus size={22} strokeWidth={3} /> New Task
            </button>
          </header>

          {/* SEARCH BOX */}
          <div className="relative mb-12 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={22} />
            <input type="text" placeholder="Search tasks..." className="w-full pl-16 pr-8 py-6 bg-white border border-slate-200 rounded-[32px] outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-medium text-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {/* TASK GRID */}
          {is_loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-white border border-slate-100 rounded-[40px] animate-pulse"></div>)}
             </div>
          ) : filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTasks.map((task) => (
                <div key={task._id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative group border-b-8 border-b-transparent hover:border-b-indigo-500">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <button onClick={() => openEditModal(task)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-50"><Pencil size={18} /></button>
                    <button onClick={() => dispatch(remove_task(task._id))} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-50"><Trash2 size={18} /></button>
                  </div>
                  
                  <div className="flex justify-between items-center mb-8">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] ${task.priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{task.priority}</span>
                    <button onClick={() => toggleStatus(task)} className="transition-all active:scale-75">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="text-emerald-500" size={28} strokeWidth={2.5} />
                      ) : (
                        <Clock className="text-slate-300 hover:text-indigo-500 transition-colors" size={28} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                  <h3 className={`text-2xl font-black mb-3 leading-tight transition-all ${task.status === 'completed' ? 'line-through text-slate-300' : 'text-slate-800'}`}>{task.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{task.description || "No additional notes for this task."}</p>
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100/50 uppercase tracking-wider">
                    <AlertCircle size={14} strokeWidth={3} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[60px] border-4 border-dashed border-slate-100 text-center px-8 shadow-inner">
              <div className="bg-indigo-50 p-10 rounded-full mb-10 shadow-xl shadow-indigo-100/50"><ClipboardList className="text-indigo-600" size={80} strokeWidth={1.5} /></div>
              <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Your board is clear.</h2>
              <button onClick={() => { dispatch(clear_task_error()); setShowModal(true); }} className="bg-indigo-600 text-white px-12 py-5 rounded-[28px] font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-200 hover:-translate-y-1 transition-all">Create First Task</button>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{editId ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={handleCloseModal} className="p-4 hover:bg-white rounded-[24px] text-slate-300 hover:text-rose-500 transition-all active:scale-90"><X size={28} strokeWidth={3} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {/* BACKEND ERROR MESSAGE ALERT */}
              {taskError && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">{taskError}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Task Title</label>
                <input required placeholder="What needs to be done?" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-lg" type="text" value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Description</label>
                <textarea placeholder="Add details..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none h-36 font-medium text-slate-700 resize-none" value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Priority</label>
                  <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700 appearance-none" value={taskData.priority} onChange={e => setTaskData({...taskData, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Deadline</label>
                  <input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700" type="date" value={taskData.dueDate} onChange={e => setTaskData({...taskData, dueDate: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black hover:bg-indigo-700 transition-all shadow-2xl active:scale-[0.98] text-xl mt-4">
                {editId ? 'Save Changes' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;