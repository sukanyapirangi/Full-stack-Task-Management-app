const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data", "tasks.json");

/* ---------------- HELPERS ---------------- */

const readTasks = async () => {
  const data = await fs.promises.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

const writeTasks = async (tasks) => {
  await fs.promises.writeFile(
    DATA_FILE,
    JSON.stringify(tasks, null, 2)
  );
};

/* ---------------- GET ALL TASKS ---------------- */
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await readTasks();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to read tasks" });
  }
});

/* ---------------- CREATE TASK ---------------- */
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, priority = "MEDIUM", dueDate = "" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const tasks = await readTasks();

    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      priority,
      dueDate
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

/* ---------------- TOGGLE COMPLETED ---------------- */
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find(t => t.id == req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await writeTasks(tasks);

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

/* ---------------- DELETE TASK ---------------- */
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    let tasks = await readTasks();
    const initialLength = tasks.length;

    tasks = tasks.filter(t => t.id != req.params.id);

    if (tasks.length === initialLength) {
      return res.status(404).json({ message: "Task not found" });
    }

    await writeTasks(tasks);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

/* ---------------- SERVER ---------------- */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
