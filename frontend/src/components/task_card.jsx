import { Calendar, Trash2, Edit3, Check} from 'lucide-react';

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700'
};

export const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
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
      
      <div className="flex items-start gap-3 mb-1">
        <label className="relative flex items-center cursor-pointer mt-1">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onToggleComplete(task)}
            className="peer hidden" />

        <div className="w-5 h-5 rounded-md border-2 border-gray-300 peer-checked:bg-green-500 peer-checked:border-green-500 flex items-center justify-center transition-all">
          {task.status === 'completed' && (
            <Check size={14} className="text-white" strokeWidth={3} />
         )}
        </div>
        </label>
            {/* TITLE */}
         <h3 className={`font-bold text-lg leading-tight ${task.status === 'completed'? 'line-through text-gray-400': 'text-gray-800'}`}>
            {task.title}
          </h3>
        </div>

      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center text-gray-400 text-xs">
        <Calendar size={14} className="mr-1" />
        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</span>
      </div>
    </div>
  );
};