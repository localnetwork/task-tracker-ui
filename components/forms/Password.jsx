import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export default function Password({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  payload,
}) {
  const [isFocused, setIsFocused] = useState({});

  const onFocus = (e) => {
    setIsFocused((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const onBlur = (e) => {
    setIsFocused((prev) => ({ ...prev, [e.target.name]: false }));
  };

  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={name}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        value={value || ""}
        onFocus={onFocus}
        onBlur={onBlur} // ✅ reset focus when clicking outside
        className={`border-[#515151] !bg-black text-white border-[2px] min-h-[65px] rounded-[50px] py-6 px-[25px] w-full focus:outline-[#1D9BF0]
          ${error ? "!border-[#1D9BF0] shadow-md shadow-white-200" : ""}
          
        `}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute top-[25px] right-5 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
      </button>
      <label
        htmlFor={name} // ✅ match the input id dynamically
        className={`absolute left-[25px] font-medium transition-all text-[#fff] ${
          isFocused?.[name] || value || error
            ? "top-[10px] text-[8px]"
            : "top-[20px] cursor-pointer text-[16px]"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
