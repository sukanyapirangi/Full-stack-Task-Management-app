import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const addTask = async () => {
    if (!title) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, priority, dueDate })
      });

      if (!res.ok) throw new Error("Failed");

      setTitle("");
      setPriority("MEDIUM");
      setDueDate("");
      onTaskAdded();
    } catch (err) {
      alert("Failed to add task");
    }
  };

  return (
    <div className="task-form">
      <input
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />

      <button onClick={addTask}>Add Task</button>
    </div>
  );
}
