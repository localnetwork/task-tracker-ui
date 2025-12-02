import { useState } from "react";

export default function Input({
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

  return (
    <div className="relative">
      <input
        type="text"
        id={name}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        value={value || ""}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete="on"
        className={`border-[#515151] !bg-black text-white border-[2px] min-h-[65px] rounded-[50px] py-6 px-[25px] w-full focus:outline-[#1D9BF0]
          ${error ? "!border-[#1D9BF0] shadow-md shadow-white-200" : ""}
           
        `}
      />
      <label
        htmlFor={name}
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
