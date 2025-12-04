import TASKAPI from "@/lib/api/task/request";
import modalState from "@/lib/store/modalState";
import taskStore from "@/lib/store/taskStore";
import validationState from "@/lib/store/validationState";
import { useState } from "react";
export default function TaskMarkComplete() {
  const [isLoading, setIsLoading] = useState(false);
  const modalInfo = modalState((state) => state.modalInfo);

  const markTaskAsComplete = async () => {
    // Implement the logic to mark the task as complete
    setIsLoading(true);
    try {
      const response = await TASKAPI.completeTask(modalInfo.task.id);

      // Update the task store to move the task from pending to completed
      taskStore.setState((state) => {
        const updatedPendingTasks = state.tasks.pendingTasks.filter(
          (t) => Number(t.id) !== Number(modalInfo.task.id)
        );

        const updatedCompletedTasks = [
          ...state.tasks.completedTasks,
          { ...response.data.data, status: "completed" },
        ];

        return {
          tasks: {
            pendingTasks: updatedPendingTasks,
            completedTasks: updatedCompletedTasks,
          },
        };
      });

      setIsLoading(false);
      validationState.setState({
        validationInfo: {
          isOpen: true,
          message: "Task marked as completed.",
        },
      });
      modalState.setState({
        modalInfo: null,
      });
    } catch (error) {
      console.error("Error marking task as complete:", error);
      switch (error?.status) {
        case 400:
          validationState.setState({
            validationInfo: {
              isOpen: true,
              message: "Invalid request. Please check the task details.",
            },
          });
          break;
        case 403:
          validationState.setState({
            validationInfo: {
              isOpen: true,
              message: "You do not have permission to complete this task.",
            },
          });
          break;
        default:
          validationState.setState({
            validationInfo: {
              isOpen: true,
              message: "Failed to mark task as complete. Please try again.",
            },
          });
          break;
      }

      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-[15px]">
      <button
        onClick={markTaskAsComplete}
        className="bg-[#eff3f4] cursor-pointer w-full text-black font-bold px-[30px] py-[15px] rounded-[50px] mt-[20px] hover:opacity-90"
        disabled={isLoading}
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
