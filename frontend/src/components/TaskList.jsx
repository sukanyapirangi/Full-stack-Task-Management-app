import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onUpdate }) {
  return (
    <>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
        />
      ))}
    </>
  );
}
