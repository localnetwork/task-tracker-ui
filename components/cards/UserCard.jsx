import persistentStore from "@/lib/store/persistentStore";
import { Ellipsis } from "lucide-react";
export default function UserCard() {
  const profile = persistentStore((state) => state.profile);

  const initials = profile.firstname[0] + profile.lastname[0];

  return (
    <div className="px-[20px] min-w-[250px] rounded-[50px] hover:bg-[#151515] flex justify-between items-start gap-x-[15px] py-[15px] ">
      <div className="min-w-[45px] h-[45px] bg-[#1A8CD8] flex items-center justify-center rounded-full text-white font-bold">
        {initials}
      </div>
      <div className="min-w-[120px]">
        <div className="text-[14px] line-clamp-1">
          {profile.firstname} {profile.lastname}
        </div>
        <div className="text-[#71767b] line-clamp-1">{profile.email}</div>
      </div>
      <div className="flex items-center h-full pt-2 pr-5 relative">
        <Ellipsis className="" />
      </div>
    </div>
  );
}
