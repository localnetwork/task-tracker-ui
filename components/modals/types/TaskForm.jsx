import CalendarField from "@/components/forms/CalendarField";
import Input from "@/components/forms/Input";
import TextEditor from "@/components/forms/TextEditor";
import TASKAPI from "@/lib/api/task/request";
import { extractErrors } from "@/lib/services/errorsExtractor";
import modalState from "@/lib/store/modalState";
import { useState } from "react";
import toast from "react-hot-toast";
import validationState from "@/lib/store/validationState";
export default function TaskForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const [errors, setErrors] = useState(null);

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const onFocus = (e) => {
    setIsFocused({
      [e.target.name]: true,
    });
  };

  const onSubmit = async (e) => {
    toast.dismiss();
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await TASKAPI.addTask(payload);
      console.log("success!!!");
      console.log("response", response);

      validationState.setState({
        validationInfo: {
          isOpen: true,
          message: "Task Added successfully.",
        },
      });
      modalState.setState({
        modalInfo: null,
      });
    } catch (error) {
      console.log("Error", error);
      setErrors(error?.data?.error);

      switch (error?.status) {
        case 400:
          validationState.setState({
            validationInfo: {
              isOpen: true,
              message: "Please check validated fields.",
            },
          });
          break;
        default:
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log("payload.duedate", payload.duedate);

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-y-[15px]">
        <Input
          id="title"
          name="title"
          label="Title"
          value={payload.title || ""}
          onChange={onChange}
          onFocus={onFocus}
          error={extractErrors(errors, "title")}
        />

        <TextEditor
          id="description"
          name="description"
          label="Enter a description"
          onChange={onChange}
          initialValue={payload.description || ""}
          error={extractErrors(errors, "description")}
        />

        <div className="bg-[#333] h-px my-4" />

        <CalendarField
          id="duedate"
          name="duedate"
          label="Select a date"
          value={payload.duedate || ""}
          onChange={onChange}
          onFocus={onFocus}
          error={extractErrors(errors, "duedate")}
        />

        <div className="bg-[#333] h-px my-4" />

        <button
          type="submit"
          className="bg-[#eff3f4] cursor-pointer text-black font-bold px-[30px] py-[15px] rounded-[50px] mt-[20px] hover:opacity-90"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
