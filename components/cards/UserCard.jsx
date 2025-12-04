import persistentStore from "@/lib/store/persistentStore";
import { Ellipsis } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import logout from "@/lib/helpers/logout";
import validationState from "@/lib/store/validationState";

export default function UserCard() {
  const profile = persistentStore((state) => state.profile);
  const initials = profile.firstname[0] + profile.lastname[0];

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
    validationState.setState({
      validationInfo: {
        isOpen: true,
        message: "You have been logged out successfully.",
      },
    });
  };

  // ⬇️ CLOSE WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="px-[20px] relative min-w-[250px] cursor-pointer rounded-[50px] hover:bg-[#151515] flex justify-between items-start gap-x-[15px] py-[15px]"
        onClick={() => setIsOpen(!isOpen)}
      >
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
          <Ellipsis />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[100] text-white bottom-[100%] rounded-[20px] w-[250px] bg-black tooltip-shadow">
          <div className="overflow-hidden rounded-[20px] relative">
            <button
              onClick={handleLogout}
              className="cursor-pointer block hover:bg-[#151515] w-full p-[15px]"
            >
              Logout
            </button>
          </div>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            width={24}
            height={24}
            className="absolute z-[200] bottom-[-20px] tooltip-arrow left-[110px] rotate-180"
          >
            <g>
              <path d="M22 17H2L12 6l10 11z"></path>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
