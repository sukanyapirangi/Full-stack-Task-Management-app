import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOAD TASKS ---------------- */
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      fetchTasks();
    }
  }, []);

  /* ---------------- SAVE TO LOCAL STORAGE ---------------- */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* ---------------- FETCH FROM API ---------------- */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER TASKS ---------------- */
  const filteredTasks = tasks.filter(task => {
    if (filter === "COMPLETED") return task.completed;
    if (filter === "PENDING") return !task.completed;
    return true;
  });

  return (
    <div className={`app ${theme}`}>
      <div className="container">

        {/* -------- HEADER -------- */}
        <div className="header">
          <div className="icon">📋</div>

          <h1>Task Manager</h1>
          <p>Organize your tasks, boost your productivity</p>

          <button
            className="theme-btn"
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        {/* -------- TASK FORM -------- */}
        <TaskForm fetchTasks={fetchTasks} />

        {/* -------- FILTERS -------- */}
        <div className="filters">
          <button
            className={filter === "ALL" ? "active" : ""}
            onClick={() => setFilter("ALL")}
          >
            All ({tasks.length})
          </button>

          <button
            className={filter === "PENDING" ? "active" : ""}
            onClick={() => setFilter("PENDING")}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>

          <button
            className={filter === "COMPLETED" ? "active" : ""}
            onClick={() => setFilter("COMPLETED")}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        {/* -------- STATUS -------- */}
        {loading && <p className="status">Loading tasks...</p>}
        {error && <p className="error">{error}</p>}

        {/* -------- TASK LIST -------- */}
        <TaskList
          tasks={filteredTasks}
          setTasks={setTasks}
          fetchTasks={fetchTasks}
        />

        {/* -------- FOOTER -------- */}
        <p className="hint">
          ✨ Drag to reorder · Click checkbox to complete · Hover to delete
        </p>

      </div>
    </div>
  );
}

export default App;
