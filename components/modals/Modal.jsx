import modalState from "@/lib/store/modalState";
import TaskForm from "./types/TaskForm";
import { XIcon } from "lucide-react";
import TaskMarkComplete from "./types/TaskMarkComplete";
export default function Modal() {
  const modalInfo = modalState((state) => state.modalInfo);
  const isOpen = modalInfo?.isOpen;
  let form;
  switch (modalInfo?.type) {
    case "TASK_CREATE":
      form = <TaskForm />;
      break;
    case "TASK_MARK_COMPLETE":
      form = <TaskMarkComplete />;
      break;
    default:
      break;
  }
  return (
    <div
      className={`${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      } fixed text-[22px] p-[50px] flex justify-center items-center top-0 left-0 w-full h-full`}
    >
      <span
        className="absolute top-0 left-0 w-full h-full bg-[#242D34] opacity-50"
        onClick={() => {
          modalState.setState({
            modalInfo: null,
          });
        }}
      />
      <div
        className={`${
          isOpen ? "translate-y-0" : "-translate-y-full"
        } transition-transform relative max-h-[calc(100vh-100px)] overflow-y-auto bg-black w-full max-w-[700px] min-h-[250px] text-white rounded-[20px] p-[50px]`}
      >
        <div className="modal-header bg-black z-100 p-[15px] flex justify-between font-bold text-[26px] mb-[20px] ">
          <span dangerouslySetInnerHTML={{ __html: modalInfo?.title }} />
          <span>
            <XIcon
              size={26}
              className="cursor-pointer"
              onClick={() => {
                modalState.setState({
                  modalInfo: null,
                });
              }}
            />
          </span>
        </div>
        <div>{form}</div>
      </div>
    </div>
  );
}
