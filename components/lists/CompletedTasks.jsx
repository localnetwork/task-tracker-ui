import TaskCard from "../cards/TaskCard";

export default function CompletedTasks({ tasks }) {
  return (
    <div className="flex flex-col gap-[25px] mt-[30px]">
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} index={index} />
      ))}
    </div>
  );
}
