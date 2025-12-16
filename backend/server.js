const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Path to JSON file
const DATA_FILE = path.join(__dirname, "data", "tasks.json");

/* ---------------- HELPER FUNCTIONS ---------------- */

// Read tasks from JSON file
const readTasks = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading tasks:", err);
    return [];
  }
};

// Write tasks to JSON file
const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error("Error writing tasks:", err);
  }
};
  app.get("/", (req, res) => {
  res.send("Task Manager Backend is running");
});


// GET all tasks

app.get("/api/tasks", (req, res) => {
  const tasks = readTasks();
  res.status(200).json(tasks);
});

// CREATE a task



app.post("/api/tasks", (req, res) => {
  const { title, priority = "MEDIUM", dueDate = "" } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const tasks = readTasks();

  const newTask = {
    id: Date.now(),
    title,
    completed: false,
    priority,
    dueDate
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

// TOGGLE task completion


app.put("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = !task.completed;
  writeTasks(tasks);

  res.status(200).json(task);
});


app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const filteredTasks = tasks.filter(t => t.id != req.params.id);

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ message: "Task not found" });
  }

  writeTasks(filteredTasks);
  res.status(204).send();
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
