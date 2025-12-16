import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Unable to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "COMPLETED") return task.completed;
    if (filter === "PENDING") return !task.completed;
    return true;
  });

  return (
    <div className={`app ${theme}`}>
      <div className="container">

        <div className="header">
          <div className="icon">📋</div>
          <h1>Task Manager</h1>
          <p>Organize your tasks efficiently</p>

          <button
            className="theme-btn"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <TaskForm onTaskAdded={fetchTasks} />

        <div className="filters">
          <button onClick={() => setFilter("ALL")}>All</button>
          <button onClick={() => setFilter("PENDING")}>Pending</button>
          <button onClick={() => setFilter("COMPLETED")}>Completed</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <TaskList tasks={filteredTasks} onUpdate={fetchTasks} />

      </div>
    </div>
  );
}

export default App;
