const API_URL = process.env.REACT_APP_API_URL;

export default function TaskItem({ task, onUpdate }) {

  const toggleTask = async () => {
    await fetch(`${API_URL}/${task.id}`, { method: "PUT" });
    onUpdate();
  };

  const deleteTask = async () => {
    await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
    onUpdate();
  };

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <div className="left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleTask}
        />
        <span>{task.title}</span>
      </div>

      <div className="right">
        <span className={`badge ${task.priority}`}>
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="date">{task.dueDate}</span>
        )}

        <button className="delete" onClick={deleteTask}>✖</button>
      </div>
    </div>
  );
}
