const API_URL =  process.env.REACT_APP_API_URL || "http://localhost:5000/api/tasks";

export default function TaskItem({ task, fetchTasks }) {

  const toggleTask = async () => {
    await fetch(`${API_URL}/${task.id}`, { method: "PUT" });
    fetchTasks();
  };

  const deleteTask = async () => {
    await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <div className="left">
        <input type="checkbox" checked={task.completed} onChange={toggleTask} />
        <span>{task.title}</span>
      </div>

      <div className="right">
        <span className={`badge ${task.priority}`}>
          {task.priority}
        </span>

        {task.dueDate && <span className="date">{task.dueDate}</span>}

        <button className="delete" onClick={deleteTask}>✖</button>
      </div>
    </div>
  );
}
