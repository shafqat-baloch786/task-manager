import { Trash2, Pencil, CheckCircle2, AlertCircle, Clock, CircleDashed } from 'lucide-react';
import { useDispatch } from 'react-redux';

import { clearTaskError } from "../store/slices/taskSlice";



const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700'
};

export const TaskCard = ({ task, openEditModal, setActiveTaskId, activeTaskId, selectedTasks, setSelectedTasks }) => {
  const dispatch = useDispatch();

  const handleOpenEditModal = () => {
    openEditModal(task);
  };

  const handleTaskSelectChange = () => {
    if (selectedTasks.includes(task._id)) {
      setSelectedTasks(selectedTasks.filter(id => id !== task._id));
    } else {
      setSelectedTasks([...selectedTasks, task._id]);
    }
  };

  const handleToggleCompleted = () => {
    dispatch(toggle_task(task._id));
  };

  const handleDelete = () => {
    dispatch(remove_task(task._id));
  };

  return (
    <div onClick={() => setActiveTaskId(activeTaskId === task._id ? null : task._id)} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative group border-b-8 border-b-transparent hover:border-b-indigo-500 has-checked:border-indigo-500">
      <div onClick={(e) => e.stopPropagation()} className={`absolute -top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 transition-all ${activeTaskId === task._id ? 'opacity-100 translate-y-1 pointer-events-auto' : 'opacity-0 translate-y-0 pointer-events-none'} md:pointer-events-auto md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-y-1`}>
        {/* Select Button */}
        <label title="Select task" className="p-2.5 rounded-2xl transition-all shadow-sm bg-white border border-slate-50 hover:bg-indigo-50">
          <input type="checkbox" className="peer hidden" onChange={handleTaskSelectChange} checked={selectedTasks.includes(task._id)} />
          <div className='w-4.5 h-4.5 rounded-md ring-2 ring-offset-1 ring-slate-400 peer-hover:ring-indigo-600 peer-checked:bg-indigo-600 peer-checked:ring-indigo-600' />
        </label>
        <button title={task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"} onClick={handleToggleCompleted} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-50" >{task.isCompleted ? <CheckCircle2 className="text-emerald-500" size={22} /> : <CircleDashed size={22} />}</button>
        <button title="Edit task" onClick={handleOpenEditModal} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-50"><Pencil size={18} /></button>
        <button title="Delete task" onClick={handleDelete} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-50"><Trash2 size={18} /></button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] ${priorityColors[task.priority]}`}>{task.priority}</span>
        <button onClick={handleToggleCompleted} className="transition-all active:scale-75">
          {task.isCompleted ? <CheckCircle2 className="text-emerald-500" size={28} strokeWidth={2.5} /> : <Clock className="text-slate-300 hover:text-indigo-500" size={28} strokeWidth={2.5} />}
        </button>
      </div>
      <h3 className={`text-2xl font-black mb-3 leading-tight ${task.isCompleted ? 'line-through text-slate-300' : 'text-slate-800'}`}>{task.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{task.description || "No additional notes for this task."}</p>
      <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100/50 uppercase tracking-wider">
        <AlertCircle size={14} strokeWidth={3} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
      </div>
    </div>
  );
};