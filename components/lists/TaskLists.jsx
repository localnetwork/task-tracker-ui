import { Calendar, CheckCircle, ChevronDown } from "lucide-react";
import taskStore from "@/lib/store/taskStore";
import { useEffect, useState } from "react";
import TASKAPI from "@/lib/api/task/request";
import PendingTasks from "./PendingTasks";
import taskSort from "@/lib/helpers/taskSort";
import CompletedTasks from "./CompletedTasks";
import modalState from "@/lib/store/modalState";

export default function TaskLists() {
  const tasks = taskStore((state) => state.tasks);
  const filterDueDate = taskStore((state) => state.taskFilters.due_date);
  const currentDate = new Date().toISOString().split("T")[0];
  const [isLoading, setIsLoading] = useState(false);

  const getRemainingHours = (dueDateStr) => {
    const now = new Date();
    const due = new Date(dueDateStr);

    let diffMs = due - now;
    if (diffMs < 0) diffMs = 0;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await TASKAPI.getTasks({
        due_date: filterDueDate || currentDate,
      });

      taskStore.setState({
        tasks: {
          pendingTasks: taskSort(response?.data?.data?.pendingTasks || []),
          completedTasks: taskSort(response?.data?.data?.completedTasks || []),
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIsLoading(false);
    }
  };

  // Refetch whenever due_date changes
  useEffect(() => {
    fetchTasks();

    if (!filterDueDate) {
      taskStore.setState({
        taskFilters: {
          due_date: new Date().toISOString().split("T")[0],
        },
      });
    }
  }, [filterDueDate]); // dependency on the filter

  // Calculate total remaining hours & minutes
  let totalHours = 0;
  let totalMinutes = 0;
  tasks?.pendingTasks?.forEach((task) => {
    const rem = getRemainingHours(task.dueDate);
    totalHours += rem.hours;
    totalMinutes += rem.minutes;
  });
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  let completedHours = 0;
  let completedMinutes = 0;
  tasks?.completedTasks?.forEach((task) => {
    const rem = getRemainingHours(task.dueDate);
    completedHours += rem.hours;
    completedMinutes += rem.minutes;
  });
  completedHours += Math.floor(completedMinutes / 60);
  completedMinutes = completedMinutes % 60;

  return (
    <div>
      {/* Calendar Filter & Header */}
      <div className="flex items-center gap-[20px] font-bold text-white text-[20px]">
        <div
          onClick={() => {
            modalState.setState({
              modalInfo: {
                type: "TASK_CALENDAR_FILTER",
                isOpen: true,
                title: "Filter by Date",
              },
            });
          }}
          className="inline-flex justify-between min-w-[150px] bg-[#151515] py-[15px] px-[20px] items-center gap-[25px] rounded-[50px] cursor-pointer"
        >
          Filter by Date <ChevronDown size={20} className="inline-block ml-2" />
        </div>

        <div className="text-[22px]">
          {filterDueDate === new Date().toISOString().split("T")[0]
            ? "Today"
            : filterDueDate}
        </div>
      </div>

      {/* Estimated Time */}
      <div className="mt-2 text-[#5e5e5e] text-[18px] py-[15px]">
        Est. {totalHours} hrs {totalMinutes} min
      </div>

      {/* Task Progress Bar */}
      <div className="mt-2 flex gap-[15px] items-center">
        <div className="w-full bg-[#151515] rounded-full relative top-[5px] h-4 overflow-hidden">
          {tasks?.completedTasks?.length > 0 && (
            <div
              className="bg-[#1A8CD8] h-4 w-0"
              style={{
                width: `${
                  tasks && tasks.pendingTasks && tasks.completedTasks
                    ? (tasks.completedTasks.length /
                        (tasks.completedTasks.length +
                          tasks.pendingTasks.length)) *
                      100
                    : 0
                }%`,
              }}
            />
          )}
        </div>
        <div className="flex min-w-[100px] leading-full items-center justify-end text-[18px] text-[#5e5e5e] font-bold mt-1">
          <span>{tasks?.completedTasks?.length || 0} </span>{" "}
          <div>
            /
            <span>
              {" "}
              {tasks?.pendingTasks?.length +
                tasks?.completedTasks?.length} done{" "}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      {tasks?.pendingTasks?.length > 0 && (
        <PendingTasks tasks={tasks?.pendingTasks} />
      )}

      {/* SHOW MESSAGE IF THERE ARE NO PENDING TASKS */}

      {tasks?.completedTasks?.length > 0 &&
        tasks?.pendingTasks?.length === 0 && (
          <div className="py-[50px] text-white flex flex-col justify-center items-center gap-[20px]">
            <CheckCircle className="text-green-400" size={100} />
            <p className="font-bold text-[20px] mt-5">
              All tasks completed! Great job!
            </p>
          </div>
        )}

      {/* Completed Tasks */}
      {tasks?.completedTasks?.length > 0 && (
        <>
          <div className="h-[1px] bg-[#333] w-full block my-[30px]" />
          <div className="flex justify-between">
            <span className="text-[#5e5e5e] text-[18px]">
              {tasks?.completedTasks?.length} DONE
            </span>
          </div>
          <CompletedTasks tasks={tasks?.completedTasks} />
        </>
      )}

      {/* Empty State */}
      {tasks?.pendingTasks?.length === 0 &&
        tasks?.completedTasks?.length === 0 &&
        !isLoading && (
          <div className="py-[100px] text-white flex flex-col justify-center items-center gap-[20px]">
            <Calendar className="opacity-50" size={150} />
            <p className="font-bold text-[20px] mt-5">
              Guess you haven't added your task{" "}
              {!filterDueDate === new Date().toISOString().split("T")[0]
                ? ""
                : "for "}
              {filterDueDate === new Date().toISOString().split("T")[0]
                ? "today"
                : filterDueDate}
              .
            </p>
          </div>
        )}
    </div>
  );
}
