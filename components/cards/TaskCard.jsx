import { CheckCircle } from "lucide-react";
import modalState from "@/lib/store/modalState";

export default function TaskCard({ task, index }) {
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

  // Parse dueDate as local time
  const parseLocalDate = (isoString) => {
    if (!isoString) return null;

    // Remove "Z" or milliseconds if present
    const cleaned = isoString.replace("Z", "").split(".")[0];

    const [datePart, timePart] = cleaned.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
  };

  const dueDate = task?.dueDate ? parseLocalDate(task.dueDate) : null;
  const now = new Date();

  // Reference date: completedAt if task is completed
  const referenceDate =
    task.isCompleted && task.completedAt
      ? parseLocalDate(task.completedAt)
      : now;

  const diffMs = dueDate ? dueDate.getTime() - referenceDate.getTime() : 0;
  const isPastDue = !task.isCompleted && diffMs < 0;

  // Calculate days, hours, minutes
  let timeRemaining = "";
  const absDiffMs = Math.abs(diffMs);
  const diffSeconds = Math.floor(absDiffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const hours = diffHours - diffDays * 24;
  const minutes = diffMinutes - diffDays * 24 * 60 - hours * 60;

  if (diffDays > 0) {
    timeRemaining = `${diffDays}d ${hours}h`;
  } else if (diffHours > 0) {
    timeRemaining = `${hours}h ${minutes}m`;
  } else {
    timeRemaining = `${minutes}m`;
  }

  // Append label
  if (task.isCompleted) {
    timeRemaining += diffMs >= 0 ? " early" : " late";
  } else if (isPastDue) {
    timeRemaining = "Past due";
  } else {
    timeRemaining += " remaining";
  }

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
        {!task.isCompleted && !isPastDue && (
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
