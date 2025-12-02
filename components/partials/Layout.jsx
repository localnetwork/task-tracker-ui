// import Header from "./Header";
import toast, { Toaster } from "react-hot-toast";
import SidebarNav from "./SidebarNav";
import persistentStore from "@/lib/store/persistentStore";
import ValidationBar from "../notifications/validations/ValidationBar";
export default function Layout({ children }) {
  const profile = persistentStore((state) => state.profile);
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        {profile && <SidebarNav />}

        <main className="grow">{children}</main>
      </div>

      <ValidationBar />
    </div>
  );
}
