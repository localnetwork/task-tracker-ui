import { AlertCircle } from "lucide-react";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarField({ label, name, value, onChange, error }) {
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );

  // Time parts
  const [hours, setHours] = useState(
    value ? new Date(value).getHours() % 12 || 12 : 12
  );
  const [minutes, setMinutes] = useState(
    value ? new Date(value).getMinutes() : 0
  );
  const [ampm, setAmpm] = useState(
    value ? (new Date(value).getHours() >= 12 ? "PM" : "AM") : "AM"
  );

  // Helper function to build ISO string
  const buildISOString = (date, hrs, mins, period) => {
    let h = hrs % 12;
    if (period === "PM") h += 12;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hourStr = String(h).padStart(2, "0");
    const minuteStr = String(mins).padStart(2, "0");

    return `${year}-${month}-${day}T${hourStr}:${minuteStr}:00.000Z`;
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const isoString = buildISOString(date, hours, minutes, ampm);
      onChange({ target: { name, value: isoString } });
    }
  };

  // Handle time changes
  const handleHoursChange = (e) => {
    const newHours = Number(e.target.value);
    setHours(newHours);
    if (selectedDate) {
      const isoString = buildISOString(selectedDate, newHours, minutes, ampm);
      onChange({ target: { name, value: isoString } });
    }
  };

  const handleMinutesChange = (e) => {
    const newMinutes = Number(e.target.value);
    setMinutes(newMinutes);
    if (selectedDate) {
      const isoString = buildISOString(selectedDate, hours, newMinutes, ampm);
      onChange({ target: { name, value: isoString } });
    }
  };

  const handleAmPmChange = (e) => {
    const newAmPm = e.target.value;
    setAmpm(newAmPm);
    if (selectedDate) {
      const isoString = buildISOString(selectedDate, hours, minutes, newAmPm);
      onChange({ target: { name, value: isoString } });
    }
  };

  // Generate dropdown options
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {/* Time selector */}
      <div>
        <label
          htmlFor={name}
          className="font-medium text-white text-[16px] cursor-pointer mb-2"
        >
          Select a time
        </label>
        <div className="flex gap-2 mt-2 text-[14px]">
          {/* Hours */}
          <select
            value={hours}
            onChange={handleHoursChange}
            className="px-3 py-2 rounded-lg bg-[#000] border-[#515151] border text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          {/* Minutes */}
          <select
            value={minutes}
            onChange={handleMinutesChange}
            className="px-3 py-2 rounded-lg bg-[#000] border-[#515151] border text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {minuteOptions.map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}
              </option>
            ))}
          </select>

          {/* AM/PM */}
          <select
            value={ampm}
            onChange={handleAmPmChange}
            className="px-3 py-2 rounded-lg bg-[#000] border-[#515151] border text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {/* Calendar selector */}
      <div>
        {label && (
          <label
            htmlFor={name}
            className="font-medium text-white text-[16px] cursor-pointer mb-2"
          >
            {label}
          </label>
        )}
        <div
          className={`relative ${
            error
              ? "border-[#1D9BF0] border p-[15px] rounded-[20px] shadow-md shadow-white-200"
              : ""
          }`}
        >
          {error && (
            <div className="absolute z-[100] group top-[25px] right-[15px] h-[30px] min-w-[30px]">
              <AlertCircle className="text-[#1D9BF0] group-hover:hidden" />
              <span className="hidden group-hover:block error-message py-[10px] bg-[#1D9BF0] text-white text-[12px] rounded-[8px] px-[10px] mt-[-5px] right-[25px] whitespace-nowrap">
                {error}
              </span>
            </div>
          )}
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            calendarType="gregory"
            className={`rounded-lg text-[14px] border w-full p-2 bg-[#151515] text-white ${
              error ? "border-red-500" : "border-neutral-700"
            }`}
            tileClassName={({ date }) => {
              const today = new Date();
              if (selectedDate) return "";
              const isToday =
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate();
              return isToday ? "calendar-today" : "";
            }}
            prevLabel="<"
            nextLabel=">"
            formatShortWeekday={(locale, date) =>
              date.toLocaleDateString(locale, { weekday: "short" })
            }
          />
        </div>
      </div>

      <style jsx global>{`
        .react-calendar {
          background-color: #151515 !important;
          color: #fff !important;
          border: none !important;
        }
        .react-calendar__navigation button {
          color: #fff !important;
          background: transparent !important;
        }
        .react-calendar__tile {
          background: #151515 !important;
          color: #fff !important;
        }
        .react-calendar__tile--active {
          background: #000 !important;
          color: #fff !important;
        }
        .react-calendar__tile--hover {
          background: #151515 !important;
        }
        .calendar-today {
          background: #000 !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}
