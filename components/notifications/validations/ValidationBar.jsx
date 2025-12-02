import validationState from "@/lib/store/validationState";
import { X } from "lucide-react";
import { useEffect } from "react";
export default function ValidationBar() {
  const validationInfo = validationState((state) => state.validationInfo);
  const duration = validationInfo?.duration || 3000;

  const isOpen = validationInfo?.isOpen;

  useEffect(() => {
    if (validationInfo?.isOpen) {
      const timer = setTimeout(() => {
        validationState.setState({ validationInfo: { isOpen: false } });
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [validationInfo]);
  return (
    <div
      className={`${
        isOpen ? "translate-y-0" : "translate-y-[100%]"
      } fixed bottom-0 w-full left-0 transition-transform duration-300 py-[20px] font-bold px-[50px] bg-[#1D9BF0] text-white`}
    >
      {validationInfo?.message}
      <span
        onClick={() => {
          validationState.setState({
            validationInfo: null,
          });
        }}
        className="absolute right-[15px] top-[15px]"
      >
        <X />
      </span>
    </div>
  );
}
