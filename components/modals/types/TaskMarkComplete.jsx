import modalState from "@/lib/store/modalState";
import taskStore from "@/lib/store/taskStore";
import validationState from "@/lib/store/validationState";
export default function TaskMarkComplete() {
  const modalInfo = modalState((state) => state.modalInfo);

  console.log("modalInfo", modalInfo?.task);

  const markTaskAsComplete = () => {
    // Implement the logic to mark the task as complete

    try {
      taskStore.setState((state) => {
        const updatedPendingTasks = state.tasks.pendingTasks.filter(
          (t) => t.id !== modalInfo.task.id
        );
        const updatedCompletedTasks = [
          ...state.tasks.completedTasks,
          { ...modalInfo.task, status: "completed" },
        ];
        return {
          tasks: {
            pendingTasks: updatedPendingTasks,
            completedTasks: updatedCompletedTasks,
          },
        };
      });
    } catch (error) {
      console.error("Error marking task as complete:", error);
      validationState.setState({
        validationInfo: {
          type: "error",
          message: "Failed to mark task as complete. Please try again.",
        },
      });
    }
  };
  return (
    <div className="flex flex-col gap-[15px]">
      <button
        onClick={markTaskAsComplete}
        className="bg-[#eff3f4] cursor-pointer w-full text-black font-bold px-[30px] py-[15px] rounded-[50px] mt-[20px] hover:opacity-90"
      >
        Yes, Mark as Complete
      </button>
      <button
        className="bg-transparent border border-white cursor-pointer w-full text-white font-bold px-[30px] py-[15px] rounded-[50px] mt-[10px] hover:opacity-90"
        onClick={() =>
          modalState.setState({
            modalInfo: { ...modalInfo, isOpen: false },
          })
        }
      >
        No, Go Back
      </button>
    </div>
  );
}
