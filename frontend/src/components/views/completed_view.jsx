import { TaskCard } from "../task_card";
import { ClipboardList, Search, Trash2 } from "lucide-react";

const DashboardView = ({ user, setActiveTab, is_loading, searchTerm, setSearchTerm, selectedTasks, setSelectedTasks, handleBulkDelete, openEditModal, activeTaskId, setActiveTaskId, filteredTasks }) => {
    const handleSelectAllChnage = () => {
        if (filteredTasks.length === selectedTasks.length) {
            setSelectedTasks([]);
        } else {
            setSelectedTasks(filteredTasks.map(task => task._id));
        }
    }
    
    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">Hello, {user.name.split(' ')[0]}!</h1>
                    <p className="text-slate-500 text-lg font-medium">{filteredTasks.length > 0 ? `${filteredTasks.length} completed tasks.` : "No tasks have been completed yet."}</p>
                </div>
            </header>

            <div className="relative mb-12 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={22} />
                <input type="text" placeholder="Search tasks..." className="w-full pl-16 pr-8 py-6 bg-white border border-slate-200 rounded-[32px] outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-medium text-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="text-slate-700 bg-white flex items-center gap-5 py-4 px-6 mb-12 rounded-4xl border border-slate-200 shadow-sm w-fit">
                <label>
                    <input type="checkbox" className="peer hidden" onChange={handleSelectAllChnage} checked={filteredTasks.length === selectedTasks.length && filteredTasks.length > 0} />
                    <div className='w-4 h-4 rounded-md ring-2 ring-offset-2 ring-slate-300 peer-hover:ring-indigo-600 peer-checked:bg-indigo-600 peer-checked:ring-indigo-600' />
                </label>
                <span>{filteredTasks.length === selectedTasks.length && filteredTasks.length > 0 ? "All Tasks" : selectedTasks.length > 1 ? selectedTasks.length + " Tasks" : selectedTasks.length + " Task"} Selected</span>

                <button className="p-2.5 text-slate-400 hover:text-rose-600 transition-colors" onClick={handleBulkDelete}><Trash2 size={20} /></button>
            </div>

            {is_loading && filteredTasks.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white border border-slate-100 rounded-[40px] animate-pulse"></div>)}
                </div>
            ) : filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTasks.map((task) => (
                        <TaskCard key={task._id} task={task} selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} openEditModal={openEditModal} setActiveTaskId={setActiveTaskId} activeTaskId={activeTaskId} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[60px] border-4 border-dashed border-slate-100 text-center px-8 shadow-inner">
                    <div className="bg-indigo-50 p-10 rounded-full mb-10 shadow-xl shadow-indigo-100/50"><ClipboardList className="text-indigo-600" size={80} strokeWidth={1.5} /></div>
                    <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">No completed tasks.</h2>
                    <button onClick={() => setActiveTab('dashboard')} className="bg-indigo-600 text-white px-12 py-5 rounded-[28px] font-black hover:bg-indigo-700 shadow-2xl transition-all">All tasks</button>
                </div>
            )}
        </div>
    )
}

export default DashboardView;