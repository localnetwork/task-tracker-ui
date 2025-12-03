import Image from "next/image";
import persistentStore from "@/lib/store/persistentStore";
import dynamic from "next/dynamic";
export default function Home() {
  const TaskLists = dynamic(() => import("../components/lists/TaskLists"));
  const profile = persistentStore((state) => state.profile);
  return (
    <div className="p-[50px]">
      {!profile ? <div>You need to login</div> : <TaskLists />}
    </div>
  );
}
