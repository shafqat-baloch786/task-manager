import { useDispatch } from "react-redux";
import { clear_task_error } from "../../store/slices/task_slice";
import { TaskCard } from "../task_card";
import { ClipboardList } from "lucide-react";

const DashboardView = ({ is_loading, filteredTasks, setShowModal, selectedTasks, setSelectedTasks, openEditModal, activeTaskId, setActiveTaskId }) => {
  const dispatch = useDispatch();

  return (
    <div className="max-w-6xl mx-auto">
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
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Your board is clear.</h2>
          <button onClick={() => { dispatch(clear_task_error()); setShowModal(true); }} className="bg-indigo-600 text-white px-12 py-5 rounded-[28px] font-black hover:bg-indigo-700 shadow-2xl transition-all">Create First Task</button>
        </div>
      )}
    </div>
  )
}

export default DashboardView;