import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  updateTask,
  clearTaskError,
  bulkDeleteTasks,
  fetchCompletedTasks,
} from "../store/slices/taskSlice";
import {
  X,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Trash2,
  ClipboardList,
} from "lucide-react";
import DashboardView from "../components/views/dashboardView";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const {
    items: allTasks,
    isLoading,
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
      dispatch(fetchTasks());
    }
  }, [dispatch, token]);

  useEffect(() => {
    setSelectedTasks([]);

    if (activeTab === "completed") {
      dispatch(fetchCompletedTasks());
    } else {
      dispatch(fetchTasks());
    }
  }, [activeTab, dispatch]);

  const openEditModal = (task) => {
    dispatch(clearTaskError());
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
    dispatch(clearTaskError());
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

    dispatch(bulkDeleteTasks(selectedTasks)).then((res) => {
      if (!res.error) {
        setSelectedTasks([]);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      dispatch(updateTask({ id: editId, updates: taskData })).then((res) => {
        if (!res.error) handleCloseModal();
      });
    } else {
      dispatch(addTask(taskData)).then((res) => {
        if (!res.error) handleCloseModal();
      });
    }
  };

  const handleSelectAllChange = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task._id));
    }
  };

  if (!user && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const items =
    activeTab === "completed"
      ? allTasks.filter((t) => t.isCompleted)
      : allTasks;

  const filteredTasks =
    items?.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <>
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
                dispatch(clearTaskError());
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
              onChange={handleSelectAllChange}
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
          isLoading={isLoading}
          filteredTasks={filteredTasks}
          setShowModal={setShowModal}
          selectedTasks={selectedTasks}
          setSelectedTasks={setSelectedTasks}
          openEditModal={openEditModal}
          activeTaskId={activeTaskId}
          setActiveTaskId={setActiveTaskId}
        />
      </main>

      {/* Modal code remains unchanged */}
    </>
  );
};

export default DashboardPage;
