import TaskItem from "./TaskItem";

export default function TaskList({ tasks, setTasks, fetchTasks }) {

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const onDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("index");
    const newTasks = [...tasks];
    const draggedTask = newTasks.splice(dragIndex, 1)[0];
    newTasks.splice(dropIndex, 0, draggedTask);

    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  return (
    <>
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, index)}
        >
          <TaskItem task={task} fetchTasks={fetchTasks} />
        </div>
      ))}
    </>
  );
}
