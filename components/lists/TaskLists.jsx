import { ChevronDown } from "lucide-react";

export default function TaskLists() {
  return (
    <div>
      <div className="flex items-center gap-[20px] font-bold text-white text-[20px]">
        <div className=" inline-flex justify-between min-w-[150px] bg-[#151515] py-[15px] px-[20px]  items-center gap-[25px] rounded-[50px] cursor-pointer">
          All <ChevronDown size={20} className="inline-block ml-2" />
        </div>

        <div>Today</div>
      </div>
    </div>
  );
}
