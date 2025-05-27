"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "@/lib/addedAxiosInstance";

import OtpInput from "./otpInput";
import { ChevronLeft } from "lucide-react";
interface PasswordFormProps {
  currentTransactionPassword?: string;
  userId?: string;
  getToken: () => Promise<string | null>;
}

export const PasswordForm = ({
  currentTransactionPassword,
  userId,
  getToken,
}: PasswordFormProps) => {
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [typedCurrentPassword, setTypedCurrentPassword] = useState("");
  const [oldPasswordMatchingError, setOldPasswordMatchingError] = useState("");
  const [allPasswordValid, setAllPasswordValid] = useState(false);
  const [validatingError, setValidatingError] = useState("");
  const [matchingError, setMatchingError] = useState(
    "Нууц үгнүүд хоорондоо таарахгүй байна."
  );
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validatePassword = (password: string): boolean => {
    const regex: RegExp =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,20}$/;
    if (!regex.test(password)) {
      setValidatingError(
        "Нууц үг дор хаяж нэг тоо, нэг үсэг болон 8-20 тэмдэгттэй байх ёстой."
      );
      return false;
    }
    setValidatingError("");
    return true;
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      validatePassword(value);
    } else {
      setValidatingError("");
    }
    if (value !== confirmPassword) {
      setMatchingError("Нууц үгнүүд хоорондоо таарахгүй байна.");
      setAllPasswordValid(false);
    } else {
      setMatchingError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setMatchingError("Нууц үгнүүд хоорондоо таарахгүй байна.");
      setAllPasswordValid(false);
    } else {
      setMatchingError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      document.getElementById("submitButton")?.click();
    }
  };

  const handleTypedCurrentPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setTypedCurrentPassword(value);
  };

  useEffect(() => {
    if (currentTransactionPassword !== typedCurrentPassword) {
      setOldPasswordMatchingError(
        "Өмнөх гүйлгээний нууц үгтэй таарахгүй байна."
      );
      setAllPasswordValid(false);
    } else {
      setOldPasswordMatchingError("");
    }
  }, [currentTransactionPassword, typedCurrentPassword]);

  useEffect(() => {
    if (
      oldPasswordMatchingError === "" &&
      matchingError === "" &&
      validatingError === "" &&
      password.length > 0 &&
      confirmPassword.length > 0
    ) {
      setAllPasswordValid(true);
    }
  }, [
    oldPasswordMatchingError,
    matchingError,
    validatingError,
    password.length,
    confirmPassword.length,
  ]);

  const handlePasswordUpdate = async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.log("No token available");
        return;
      }
      const response = await axiosInstance.put(
        `/users/transaction-password/update`,
        { userId: userId, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        toast("Нууц үг амжилттай шинэчлэгдлээ!", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setPassword("");
        setTypedCurrentPassword("");
        setConfirmPassword("");
      } else {
        console.log(
          response.data?.message || "Нууц үг шинэчлэхэд алдаа гарлаа."
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleForgotPassword = () => {
    setIsOtpDialogOpen(true);
  };

  return (
    <>
      {isOtpDialogOpen ? (
        <div className="w-full flex flex-col gap-6">
          <OtpInput getToken={getToken} />
          <div
            className="flex cursor-pointer w-fit hover:text-blue-600"
            onClick={() => setIsOtpDialogOpen(false)}>
            <ChevronLeft />
            <div className="hover:text-blue-600">буцах</div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          <div className="text-lg font-medium ">
            <p>Гүйлгээний нууц үг өөрчлөх</p>
            <p
              onClick={handleForgotPassword}
              className="w-fit text-sm hover:underline cursor-pointer">
              Нууц үгээ мартсан уу?
            </p>
          </div>
          <div
            className={`flex justify-between items-center rounded-md w-1/2 min-w-[240px] border h-[2.25rem] px-2 ${
              oldPasswordMatchingError
                ? "border-[#ef4444] border-opacity-50"
                : "border-gray-300"
            }`}>
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="w-full focus:outline-0"
              placeholder="Хуучин нууц үг"
              value={typedCurrentPassword}
              onChange={handleTypedCurrentPassword}
            />
          </div>
          {oldPasswordMatchingError && (
            <div className="text-red-600">{oldPasswordMatchingError}</div>
          )}
          <div
            className={`flex justify-between items-center rounded-md w-1/2 min-w-[240px] border h-[2.25rem] px-2 ${
              validatingError
                ? "border-[#ef4444] border-opacity-50"
                : "border-gray-300"
            }`}>
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              className="w-full focus:outline-0"
              placeholder="Шинэ нууц үг"
              onChange={handlePasswordChange}
              value={password}
            />
          </div>
          <div
            className={`flex justify-between items-center rounded-md w-1/2 min-w-[240px] border h-[2.25rem] px-2 ${
              validatingError
                ? "border-[#ef4444] border-opacity-50"
                : "border-gray-300"
            }`}>
            <input
              id="checkpassword"
              className="w-full focus:outline-0"
              placeholder="Шинэ нууц үг давтах"
              type={isPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {validatingError && <p className="text-red-600">{validatingError}</p>}
          {matchingError && <p className="text-red-600">{matchingError}</p>}
          <div className="flex items-center">
            <input
              type="checkbox"
              onChange={(e) => setIsPasswordVisible(e.target.checked)}
            />
            <span className="ml-2">Нууц үг харуулах</span>
          </div>
          <div>
            <button
              onClick={handlePasswordUpdate}
              id="submitButton"
              disabled={!allPasswordValid}
              className="w-full dark:bg-green-700 dark:text-white bg-[#18181B] text-[#fafafa] rounded-md h-[2.25rem]"
              style={{
                opacity: allPasswordValid ? 1 : 0.2,
                cursor: allPasswordValid ? "pointer" : "not-allowed",
              }}>
              Нууц үг шинэчлэх
            </button>
          </div>
        </div>
      )}
    </>
  );
};
