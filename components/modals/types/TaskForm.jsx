import CalendarField from "@/components/forms/CalendarField";
import Input from "@/components/forms/Input";
import TextEditor from "@/components/forms/TextEditor";
import TASKAPI from "@/lib/api/task/request";
import { extractErrors } from "@/lib/services/errorsExtractor";
import modalState from "@/lib/store/modalState";
import { useState } from "react";
import toast from "react-hot-toast";
import validationState from "@/lib/store/validationState";
import taskStore from "@/lib/store/taskStore";
import taskSort from "@/lib/helpers/taskSort";

export default function TaskForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const [errors, setErrors] = useState(null);

  const tasks = taskStore((state) => state.tasks);
  const taskFilters = taskStore((state) => state.taskFilters);
  const taskFilterDueDate = taskFilters.due_date;

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const onFocus = (e) => {
    setIsFocused({
      [e.target.name]: true,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setIsLoading(true);

    try {
      const response = await TASKAPI.addTask(payload);
      const newTask = response.data.data.task;
      const dueDate = new Date(newTask.dueDate);

      console.log("newTask", newTask);

      // Normalize dates to YYYY-MM-DD for comparison
      const formatDate = (date) => new Date(date).toISOString().split("T")[0];

      const filterDate = taskFilterDueDate ? new Date(taskFilterDueDate) : null;

      const isSameFilterDate =
        filterDate && formatDate(filterDate) === formatDate(dueDate);

      console.log("isSameFilterDate", isSameFilterDate, filterDate, dueDate);

      if (isSameFilterDate) {
        // Insert into pending tasks in order
        taskStore.setState((state) => {
          const pendingTasks = [...state.tasks.pendingTasks];

          const insertIndex = pendingTasks.findIndex(
            (task) => new Date(newTask.dueDate) < new Date(task.dueDate)
          );

          if (insertIndex === -1) pendingTasks.push(newTask);
          else pendingTasks.splice(insertIndex, 0, newTask);
          const combinedTasks = [
            ...pendingTasks,
            ...state.tasks.completedTasks,
          ];
          return {
            tasks: {
              pendingTasks: pendingTasks,
              completedTasks: state.tasks.completedTasks,
            },
          };
        });
      } else {
        console.log("not same day!");
        // Task does not match filter date
        const prettyDate = dueDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        validationState.setState({
          validationInfo: {
            isOpen: true,
            message: `Task saved. View it on ${prettyDate}.`,
          },
        });
      }

      validationState.setState({
        validationInfo: {
          isOpen: true,
          message: "Task added successfully.",
        },
      });

      modalState.setState({ modalInfo: null });
      setPayload({}); // clear form
    } catch (error) {
      console.log("Error", error);
      setErrors(error?.data?.error);

      if (error?.status === 400) {
        validationState.setState({
          validationInfo: {
            isOpen: true,
            message: "Please check validated fields.",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-y-[15px]">
        <Input
          id="title"
          name="title"
          label="Title"
          value={payload.title || ""}
          onChange={onChange}
          onFocus={onFocus}
          error={extractErrors(errors, "title")}
        />

        <TextEditor
          id="description"
          name="description"
          label="Enter a description"
          onChange={onChange}
          initialValue={payload.description || ""}
          error={extractErrors(errors, "description")}
        />

        <div className="bg-[#333] h-px my-4" />

        <CalendarField
          id="dueDate"
          name="duedate"
          label="Select a date"
          value={payload.dueDate || ""}
          onChange={onChange}
          onFocus={onFocus}
          error={extractErrors(errors, "duedate")}
        />

        <div className="bg-[#333] h-px my-4" />

        <button
          type="submit"
          className="bg-[#eff3f4] cursor-pointer text-black font-bold px-[30px] py-[15px] rounded-[50px] mt-[20px] hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
