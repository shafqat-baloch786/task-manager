import { Calendar, Trash2, Edit3 } from 'lucide-react';

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700'
};

export const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${priorityColors[task.priority] || 'bg-gray-100'}`}>
          {task.priority}
        </span>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-blue-500 transition-colors"><Edit3 size={18} /></button>
          <button onClick={() => onDelete(task._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
        </div>
      </div>
      
      <h3 className="font-bold text-gray-800 text-lg mb-1">{task.title}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center text-gray-400 text-xs">
        <Calendar size={14} className="mr-1" />
        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</span>
      </div>
    </div>
  );
};