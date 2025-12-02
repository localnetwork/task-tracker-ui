import BaseApi from "@/lib/api/_base.api";
import AUTHAPI from "@/lib/api/auth/request";
import Image from "next/image";
import persistentStore from "@/lib/store/persistentStore";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "@/components/icons/Spinner";
import { extractErrors } from "@/lib/services/errorsExtractor";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // 👁️ Eye icons
import Link from "next/link";
import Input from "@/components/forms/Input";
import Password from "@/components/forms/Password";
import validationState from "@/lib/store/validationState";
export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state
  const [payload, setPayload] = useState({});

  const [isFocused, setIsFocused] = useState(false);
  const validationInfo = validationState((state) => state.validationInfo);

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const onFocus = (e) => {
    setIsFocused({
      [e.target.name]: true,
    });
  };

  const onLogin = async (e) => {
    toast.dismiss();
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AUTHAPI.login(payload);
      persistentStore.setState({ profile: response?.data?.user });
      router.push("/");
    } catch (error) {
      console.log("Error", error.status);

      setErrors(error?.data?.error);

      switch (error?.status) {
        case 400:
          validationState.setState({
            validationInfo: {
              type: "login",
              isOpen: true,
              message: "Please check validated fields.",
            },
          });
          break;
        case 401:
          validationState.setState({
            validationInfo: {
              type: "login",
              isOpen: true,
              message:
                "We couldn't log you in. Please check your credentials and try again.",
            },
          });
          break;
        default:
          toast.error("An unexpected error occurred. Please try again later.");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-92px)]">
      <div className="container py-[50px]">
        <div className="grid max-w-[540px] mx-auto">
          {/* RIGHT FORM */}
          <div className="py-[50px]">
            <h2 className="text-3xl text-white text-center font-bold mb-6">
              Sign In to Task Tracker
            </h2>

            <form className="flex flex-col gap-y-[20px]" onSubmit={onLogin}>
              <Input
                id="email"
                name="email"
                label="Email"
                value={payload.email || ""}
                onChange={onChange}
                onFocus={onFocus}
                error={extractErrors(errors, "email")}
              />

              {/* PASSWORD with Eye Icon */}
              <Password
                id="password"
                name="password"
                label="Password"
                value={payload.password || ""}
                onChange={onChange}
                onFocus={onFocus}
                error={extractErrors(errors, "password")}
              />

              {/* SUBMIT BUTTON */}
              <div>
                <button
                  type="submit"
                  className={`shadow-md font-bold bg-[#EFF3F4] w-full text-[#333] px-[30px] py-[20px] rounded-[50px] inline-flex justify-center items-center gap-[10px] text-[22px] text-center min-w-[150px] hover:opacity-90 cursor-pointer ${
                    isLoading ? "opacity-70" : "hover:opacity-90 cursor-pointer"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Spinner className="w-5 h-5 text-white animate-spin opacity-30" />
                  )}
                  Login
                </button>
              </div>
            </form>

            <div className="divider border-b border-[2px] border-[#f5f5f5] my-[40px]" />

            <div className="bg-[#e2e2e2] font-light text-[18px] px-[30px] py-[20px] mt-[20px] text-center border-b border-[#333]">
              Don't have an account?{" "}
              <Link href="/register" className="underline font-bold">
                Sign up
              </Link>
            </div>
            <div className="bg-[#e2e2e2] px-[30px] py-[20px] text-center">
              <Link href="/forgot-password" className="underline font-bold">
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
