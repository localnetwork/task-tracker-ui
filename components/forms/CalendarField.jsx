import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
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

  // Update parent payload whenever date or time changes
  useEffect(() => {
    if (selectedDate) {
      let h = hours % 12;
      if (ampm === "PM") h += 12;
      const combined = new Date(selectedDate);
      combined.setHours(h);
      combined.setMinutes(minutes);
      combined.setSeconds(0);
      const phDate = new Date(combined.getTime() + 8 * 60 * 60 * 1000);
      onChange({
        target: { name, value: phDate.toISOString() },
      });
    }
  }, [selectedDate, hours, minutes, ampm]);

  // Generate dropdown options
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <div>
        <label
          htmlFor={name}
          className="font-medium text-white text-[16px] cursor-pointer mb-2"
        >
          Select a time
        </label>
        {/* Time dropdowns */}
        <div className="flex gap-2 mt-2 text-[14px]">
          {/* Hours */}
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
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
            onChange={(e) => setMinutes(Number(e.target.value))}
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
            onChange={(e) => setAmpm(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#000] border-[#515151] border text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
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
          className={`${
            error
              ? "border-[#1D9BF0] border p-[15px] rounded-[20px] shadow-md shadow-white-200"
              : ""
          } relative`}
        >
          {error && (
            <div className="absolute z-[100] group top-[25px] right-[15px] h-[30px] min-w-[30px] ">
              <AlertCircle className="text-[#1D9BF0] group-hover:hidden" />

              <span className="hidden group-hover:block error-message py-[10px] bg-[#1D9BF0] text-white text-[12px] rounded-[8px] px-[10px] mt-[-5px] right-[25px] whitespace-nowrap">
                {error}
              </span>
            </div>
          )}
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            calendarType="gregory"
            className={`rounded-lg text-[14px] border w-full p-2 bg-[#151515] text-white ${
              error ? "border-red-500" : "border-neutral-700"
            }`}
            tileClassName="text-white hover:bg-neutral-800 rounded-md"
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
      `}</style>
    </div>
  );
}
