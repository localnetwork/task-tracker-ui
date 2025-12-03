import BaseApi from "@/lib/api/_base.api";
import AUTHAPI from "@/lib/api/auth/request";
import Image from "next/image";
import persistentStore from "@/lib/store/persistentStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "@/components/icons/Spinner";
import { extractErrors } from "@/lib/services/errorsExtractor";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // 👁️ Icons
import Check from "@/components/icons/Check";
import Input from "@/components/forms/Input";
import Password from "@/components/forms/Password";
import Link from "next/link";
import validationState from "@/lib/store/validationState";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // 👁️ Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("3"); // default Student
  const [payload, setPayload] = useState({});

  const [isFocused, setIsFocused] = useState(false);

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const onFocus = (e) => {
    setIsFocused({
      [e.target.name]: true,
    });
  };

  const onRegister = async (e) => {
    toast.dismiss();
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
      firstname: e.target.firstname.value,
      lastname: e.target.lastname.value,
    };

    try {
      const response = await AUTHAPI.register(payload);
      persistentStore.setState({ profile: response?.data?.user });
      router.push("/");

      validationState.setState({
        validationInfo: {
          isOpen: true,
          message: "Registration successful! Logged in.",
        },
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

  console.log("errors", errors);
  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady, router.query.mode]);

  return (
    <div className="min-h-[calc(100vh-92px)] py-[30px]">
      <div className="container py-[50px]">
        <div className="grid max-w-[540px] mx-auto">
          {/* RIGHT FORM */}
          <div className="">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={60}
              height={60}
              className="mx-auto mb-[20px]"
            />
            <h2 className="text-3xl text-white text-center font-bold mb-6">
              Sign Up to Task Tracker
            </h2>

            <form className="flex flex-col gap-y-[20px]" onSubmit={onRegister}>
              <div className="grid gap-[15px]">
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  value={payload.email || ""}
                  onChange={onChange}
                  onFocus={onFocus}
                  error={extractErrors(errors, "email")}
                />

                <Input
                  id="firstname"
                  name="firstname"
                  label="First Name"
                  value={payload.firstname || ""}
                  onChange={onChange}
                  onFocus={onFocus}
                  error={extractErrors(errors, "firstname")}
                />

                <Input
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  value={payload.lastname || ""}
                  onChange={onChange}
                  onFocus={onFocus}
                  error={extractErrors(errors, "lastname")}
                />

                <Password
                  id="password"
                  name="password"
                  label="Password"
                  value={payload.password || ""}
                  onChange={onChange}
                  onFocus={onFocus}
                  error={extractErrors(errors, "password")}
                />
                <Password
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  value={payload.confirmPassword || ""}
                  onChange={onChange}
                  onFocus={onFocus}
                  error={extractErrors(errors, "confirmPassword")}
                />
              </div>

              {/* SUBMIT */}
              <div>
                <button
                  type="submit"
                  className={`shadow-md  bg-[#EFF3F4] w-full text-[#333] font-semibold px-[30px] py-[20px] rounded-[50px] inline-flex justify-center items-center gap-[10px] text-[18px] text-center min-w-[150px] hover:opacity-90 cursor-pointer ${
                    isLoading
                      ? "!opacity-70"
                      : "hover:opacity-90 cursor-pointer"
                  }`}
                  disabled={isLoading}
                >
                  Continue
                </button>
              </div>
            </form>

            <div className="divider border-b border-[2px] border-[#f5f5f5] my-[40px]" />

            <div className="bg-[#e2e2e2] font-light text-[18px] px-[30px] py-[20px] mt-[20px] text-center border-b border-[#333]">
              Already have an account?{" "}
              <Link href="/login" className="underline font-bold">
                Log in
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
