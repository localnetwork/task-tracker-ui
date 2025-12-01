// import Header from "./Header";
import toast, { Toaster } from "react-hot-toast";
export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <main className="grow">{children}</main>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
