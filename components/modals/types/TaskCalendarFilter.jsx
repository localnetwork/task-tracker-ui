import { useState, useEffect } from "react";
import taskStore from "@/lib/store/taskStore";
import Calendar from "react-calendar";
import modalState from "@/lib/store/modalState";

export default function TaskCalendarFilter() {
  const taskFilters = taskStore((state) => state.taskFilters);
  const taskFilterDueDate = taskFilters.due_date;

  // Local state for selected date before applying
  const [selectedDate, setSelectedDate] = useState(
    taskFilterDueDate ? new Date(taskFilterDueDate) : null
  );

  // Sync local state if store value changes externally
  useEffect(() => {
    setSelectedDate(taskFilterDueDate ? new Date(taskFilterDueDate) : null);
  }, [taskFilterDueDate]);

  // Format a date to YYYY-MM-DD in **local timezone**
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months 0-11
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const applyFilters = () => {
    if (selectedDate) {
      taskStore.setState((state) => ({
        taskFilters: {
          ...state.taskFilters,
          due_date: formatLocalDate(selectedDate),
        },
      }));
      modalState.setState({ modalInfo: { isOpen: false } });
    }
  };

  return (
    <div>
      <Calendar
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />

      <button
        onClick={applyFilters}
        className="bg-[#eff3f4] cursor-pointer w-full text-black font-bold px-[30px] py-[15px] rounded-[50px] mt-[20px] hover:opacity-90"
      >
        Apply Filter
      </button>

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          background-color: #151515;
          color: #fff;
          border: none;
        }
        .react-calendar__navigation button {
          color: #fff;
          background: transparent;
        }
        .react-calendar__tile {
          background: #151515;
          color: #fff;
          pointer-events: all; /* ensures click works */
        }
        .react-calendar__tile--active {
          background: #000;
          color: #fff;
        }
        .react-calendar__tile:hover {
          background: #1a1a1a;
          cursor: pointer;
        }
        .calendar-today {
          background: #000;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
