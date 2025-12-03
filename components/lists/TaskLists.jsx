import { Calendar, ChevronDown } from "lucide-react";
import taskStore from "@/lib/store/taskStore";
import { useEffect, useState } from "react";
import TASKAPI from "@/lib/api/task/request";
import PendingTasks from "./PendingTasks";

export default function TaskLists() {
  const tasks = taskStore((state) => state.tasks);
  const currentDate = new Date().toISOString().split("T")[0];
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await TASKAPI.getTasks({ due_date: currentDate });

      taskStore.setState({
        tasks: {
          pendingTasks: response?.data?.data?.pendingTasks || [],
          completedTasks: response?.data?.data?.completedTasks || [],
        },
        taskFilters: { due_date: currentDate },
      });
      setIsLoading(false);
    } catch (error) {
      // taskStore.setState({ tasks: { pendingTasks: [], completedTasks: [] } });
      console.error("Error fetching tasks:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  console.log("tasks", tasks.pendingTasks);

  return (
    <div>
      <div className="flex items-center gap-[20px] font-bold text-white text-[20px]">
        <div className=" inline-flex justify-between min-w-[150px] bg-[#151515] py-[15px] px-[20px]  items-center gap-[25px] rounded-[50px] cursor-pointer">
          All <ChevronDown size={20} className="inline-block ml-2" />
        </div>

        <div className="text-[22px]">
          {currentDate == new Date().toISOString().split("T")[0]
            ? "Today"
            : currentDate}
        </div>
      </div>

      {tasks.pendingTasks.length > 0 && (
        <>
          <PendingTasks tasks={tasks.pendingTasks} />
        </>
      )}

      {tasks.pendingTasks.length == 0 &&
        tasks.completedTasks.length === 0 &&
        !isLoading && (
          <div className="py-[100px] text-white flex flex-col justify-center items-center gap-[20px]">
            <Calendar className="opacity-50" size={150} />
            <p className="font-bold text-[20px] mt-5">
              Guess you {`haven't `} added your task today.{" "}
            </p>
          </div>
        )}
    </div>
  );
}
