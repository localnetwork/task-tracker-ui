import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { AlertCircle } from "lucide-react";

export default function TextEditor({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  payload,
}) {
  return (
    <div
      className={`${
        error ? "border-[#1D9BF0] shadow-md shadow-white-200" : ""
      }`}
    >
      <label className="font-medium relative text-[#fff] cursor-pointer text-[16px] mb-3 block">
        {label}
      </label>

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
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={value} // controlled
          name={name}
          init={{
            height: 200,
            menubar: false,
            toolbar: false, // hide toolbar
            navigation: false,
            skin: "oxide-dark",
            content_css: "dark",
            content_style: `
            body { 
              background-color: #151515 !important; 
              color: #fff !important; 
            }
            p, span, div {
              color: #fff !important;
            }
          `,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks fullscreen",
              "insertdatetime media table paste wordcount",
            ],
          }}
          onEditorChange={(content) =>
            onChange({
              target: {
                name,
                value: content,
              },
            })
          }
        />
      </div>
    </div>
  );
}
