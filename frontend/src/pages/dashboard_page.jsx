import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetch_tasks,
  add_task,
  update_task,
  clear_task_error,
  bulk_delete_tasks,
  fetch_completed_tasks,
} from "../store/slices/task_slice";
import {
  X,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Trash2,
  ClipboardList,
} from "lucide-react";
import DashboardView from "../components/views/dashboard_view";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const {
    items: allTasks,
    is_loading,
    error: taskError,
  } = useSelector((state) => state.tasks);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "pending",
  });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (token) {
      dispatch(fetch_tasks());
    }
  }, [dispatch, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedTasks([]);
    if (activeTab === "completed") {
      dispatch(fetch_completed_tasks());
    } else {
      dispatch(fetch_tasks());
    }
  }, [activeTab, dispatch]);

  const openEditModal = (task) => {
    dispatch(clear_task_error());
    setEditId(task._id);
    setTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      status: task.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    dispatch(clear_task_error());
    setShowModal(false);
    setEditId(null);
    setTaskData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      status: "pending",
    });
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

  const handleSelectAllChnage = () => {
    if (selectedTasks.length === items.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task._id));
    }
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

  // Filters if active tab is completed and a task is toggled
  const items = activeTab === "completed" ? allTasks.filter((t) => t.isCompleted) : allTasks;

  const filteredTasks =
    items?.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <>
      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
              Hello, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              {activeTab === "all"
                ? items.length > 0
                  ? `Focus on your ${items.length} active tasks today.`
                  : "Your workspace is ready for new ideas."
                : items.length > 0
                ? `You have completed ${items.length} tasks so far.`
                : "You haven't completed any tasks yet."}
            </p>
          </div>
          <div className="flex gap-6">
            <button
              onClick={() =>
                setActiveTab((prev) => (prev === "all" ? "completed" : "all"))
              }
              className="flex items-center gap-3 text-indigo-600 bg-white px-10 py-5 rounded-[24px] font-black hover:bg-indigo-50 shadow-sm transition-all hover:-translate-y-1 active:scale-95"
            >
              {activeTab === "all" ? (
                <>
                  <CheckCircle2 size={22} strokeWidth={3} /> Completed Tasks
                </>
              ) : (
                <>
                  <ClipboardList size={22} strokeWidth={3} /> All Tasks
                </>
              )}
            </button>
            <button
              onClick={() => {
                dispatch(clear_task_error());
                setShowModal(true);
              }}
              className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95"
            >
              <Plus size={22} strokeWidth={3} /> New Task
            </button>
          </div>
        </header>

        <div className="relative mb-12 group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
            size={22}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-200 rounded-[32px] outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="text-slate-700 bg-white flex items-center gap-5 py-4 px-6 mb-12 rounded-4xl border border-slate-200 shadow-sm w-fit">
          <label>
            <input
              type="checkbox"
              className="peer hidden"
              onChange={handleSelectAllChnage}
              checked={
                filteredTasks.length === selectedTasks.length &&
                filteredTasks.length > 0
              }
            />
            <div className="w-4 h-4 rounded-md ring-2 ring-offset-2 ring-slate-300 peer-hover:ring-indigo-600 peer-checked:bg-indigo-600 peer-checked:ring-indigo-600" />
          </label>
          <span>
            {filteredTasks.length === selectedTasks.length &&
            filteredTasks.length > 0
              ? "All Tasks"
              : selectedTasks.length > 1
              ? selectedTasks.length + " Tasks"
              : selectedTasks.length + " Task"}{" "}
            Selected
          </span>

          <button
            className="p-2.5 text-slate-400 hover:text-rose-600 transition-colors"
            onClick={handleBulkDelete}
          >
            <Trash2 size={20} />
          </button>
        </div>

        <DashboardView
          is_loading={is_loading}
          filteredTasks={filteredTasks}
          setShowModal={setShowModal}
          selectedTasks={selectedTasks}
          setSelectedTasks={setSelectedTasks}
          openEditModal={openEditModal}
          activeTaskId={activeTaskId}
          setActiveTaskId={setActiveTaskId}
        />
      </main>

      {/* TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {editId ? "Edit Task" : "New Task"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-4 hover:bg-white rounded-[24px] text-slate-300 hover:text-rose-500 transition-all active:scale-90"
              >
                <X size={28} strokeWidth={3} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {taskError && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl">
                  <AlertCircle size={20} />{" "}
                  <p className="text-sm font-bold">{taskError}</p>
                </div>
              )}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Task Title
                </label>
                <input
                  required
                  placeholder="What needs to be done?"
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-lg"
                  type="text"
                  value={taskData.title}
                  onChange={(e) =>
                    setTaskData({ ...taskData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Description
                </label>
                <textarea
                  placeholder="Add details..."
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none h-36 font-medium text-slate-700 resize-none"
                  value={taskData.description}
                  onChange={(e) =>
                    setTaskData({ ...taskData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    Priority
                  </label>
                  <select
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700 appearance-none"
                    value={taskData.priority}
                    onChange={(e) =>
                      setTaskData({ ...taskData, priority: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    Deadline
                  </label>
                  <input
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700"
                    type="date"
                    value={taskData.dueDate}
                    onChange={(e) =>
                      setTaskData({ ...taskData, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black hover:bg-indigo-700 transition-all shadow-2xl active:scale-[0.98] text-xl mt-4"
              >
                {editId ? "Save Changes" : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
