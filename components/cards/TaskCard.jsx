import { CheckCircle } from "lucide-react";
import modalState from "@/lib/store/modalState";

export default function TaskCard({ task, index }) {
  // Function to open modal to mark task complete
  const markComplete = () => {
    modalState.setState({
      modalInfo: {
        title: `Would you like to mark task <span class="text-[#1A8CD8] font-bold">${task.title}</span> as complete?`,
        isOpen: true,
        type: "TASK_MARK_COMPLETE",
        task: task,
      },
    });
  };

  // Calculate time remaining
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  let timeRemaining = "";

  const diffMs = dueDate.getTime() - now.getTime(); // difference in milliseconds

  if (diffMs > 0) {
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const hours = diffHours - diffDays * 24;
    const minutes = diffMinutes - diffDays * 24 * 60 - hours * 60;

    if (diffDays > 0) {
      timeRemaining = `${diffDays}d ${hours}h remaining`;
    } else if (diffHours > 0) {
      timeRemaining = `${hours}h ${minutes}m remaining`;
    } else {
      timeRemaining = `${minutes}m remaining`;
    }
  } else {
    timeRemaining = "Past due";
  }

  const isPastDue = dueDate.getTime() < now.getTime();

  return (
    <div
      key={task.id}
      className={`flex relative group gap-[15px] rounded-[20px] p-[30px] text-white bg-[#151515] ${
        isPastDue ? "opacity-50" : ""
      }`}
    >
      {/* Task index */}
      <span className="index text-[#505050] font-bold text-[20px]">
        {index + 1}
      </span>

      <div className="flex-1 relative">
        {/* Task title */}
        <h3 className="text-[25px] mt-[-5px]">{task.title}</h3>

        {/* Task description */}
        <div
          dangerouslySetInnerHTML={{ __html: task.description }}
          className="text-[#999999] text-[14px] mt-[5px] max-w-[600px] leading-[20px]"
        />

        {/* Time remaining */}
        <p className="text-[#999999] text-[14px] mt-[5px]">{timeRemaining}</p>

        {/* Mark complete button */}
        {!isPastDue && (
          <span
            className="absolute group-hover:block hidden top-[15px] right-[15px] cursor-pointer"
            onClick={markComplete}
          >
            <CheckCircle className="text-white" size={30} />
          </span>
        )}
      </div>
    </div>
  );
}
