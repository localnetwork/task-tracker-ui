import { setCookie } from "nookies";
import persistentStore from "@/lib/store/persistentStore";
import taskStore from "@/lib/store/taskStore";

const logout = () => {
  setCookie({}, process.env.NEXT_PUBLIC_TOKEN, "", {
    path: "/",
  });
  persistentStore.setState({ profile: null });
  taskStore.setState({ tasks: null });
};

export default logout;
