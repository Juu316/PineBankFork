"use client";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { axiosInstance } from "@/lib/addedAxiosInstance";
import { Button } from "@/components/ui/button";
interface PasswordFormProps {
  userId?: string;
  getToken: () => Promise<string | null>;
}
export default function OtpInput({ userId, getToken }: PasswordFormProps) {
  const { user } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const username = user?.username;
  const [isVerifying, setIsVerifying] = useState(false);
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(() => {
    const storedTime = localStorage.getItem("lastPasswordRequestTime");
    return storedTime ? parseInt(storedTime) : null;
  });
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only digits
    inputsRef.current[index].value = value;

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !inputsRef.current[index].value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  const CountdownToast = ({ seconds }: { seconds: number }) => (
    <div className="flex items-center">
      <span className="mr-2">⏳</span>
      <span>Та {seconds} секунд хүлээх шаардлагатай...</span>
    </div>
  );
  const sendOtp = () => {
    const now = Date.now();
    const cooldownPeriod = 60000; // 60 seconds

    // Check localStorage first (in case it changed elsewhere)
    const storedTime = localStorage.getItem("lastPasswordRequestTime");
    const effectiveLastRequestTime = storedTime
      ? parseInt(storedTime)
      : lastRequestTime;

    if (
      effectiveLastRequestTime &&
      now - effectiveLastRequestTime < cooldownPeriod
    ) {
      const secondsLeft = Math.ceil(
        (cooldownPeriod - (now - effectiveLastRequestTime)) / 1000
      );

      const toastId = toast(<CountdownToast seconds={secondsLeft} />, {
        position: "bottom-left",
        autoClose: false,
      });

      const interval = setInterval(() => {
        const currentStoredTime = localStorage.getItem(
          "lastPasswordRequestTime"
        );
        const currentEffectiveTime = currentStoredTime
          ? parseInt(currentStoredTime)
          : effectiveLastRequestTime;

        const remaining = Math.ceil(
          (cooldownPeriod - (Date.now() - currentEffectiveTime)) / 1000
        );

        if (remaining <= 0) {
          clearInterval(interval);
          toast.dismiss(toastId);
          toast.success("Одоо дахин оролдож болно!", {
            position: "bottom-left",
          });
        } else {
          toast.update(toastId, {
            render: <CountdownToast seconds={remaining} />,
          });
        }
      }, 1000);

      return;
    }

    if (isRequesting) return;

    try {
      setIsRequesting(true);
      axiosInstance.post("/mail/reset-transaction-password", {
        email,
        username,
      });
      const newRequestTime = Date.now();
      setLastRequestTime(newRequestTime);
      localStorage.setItem(
        "lastPasswordRequestTime",
        newRequestTime.toString()
      );
      toast.success("Нууц үг сэргээх холбоос имайл хаяг руу тань илгээгдлээ!", {
        position: "bottom-left",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Алдаа гарлаа!", {
        position: "bottom-left",
      });
    } finally {
      setIsRequesting(false);
      setIsButtonHidden(true);
    }
  };
  const verifyOTP = async () => {
    function reloadWindowAfterDelay() {
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milliseconds = 2 seconds
    }
    const otpValue = inputsRef.current.map((input) => input?.value).join("");
    console.log("otpValue:", otpValue);
    if (otpValue.length !== 6) {
      // Assuming 6-digit OTP
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await axiosInstance.post("/verify-otp", {
        email: email,
        otp: otpValue,
      });

      if (response.data.success) {
        const token = await getToken();

        if (!token) {
          console.log("No token available");
          return;
        }
        try {
          await axiosInstance.put(
            `/verify-otp/reset`,
            { userId: userId },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log("EEEEEEROR", error);
        }

        toast.success("OTP verified successfully!");
        reloadWindowAfterDelay();
        // Proceed with password reset flow
      } else {
        toast.error("Invalid OTP code");
        // Optionally clear inputs
        inputsRef.current.forEach((input) => {
          if (input) input.value = "";
        });
        inputsRef.current[0]?.focus();
      }
    } catch (error) {
      toast.error("Error verifying OTP");
      console.error("OTP verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <>
      {isButtonHidden ? (
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium">
            Имайлээ руу тань явуулсан 6 оронтой тоог оруулна уу
          </p>

          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                pattern="\d*"
                className="w-[1.6rem] h-[2rem] sm:w-10 sm:h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                ref={(el) => {
                  if (el) inputsRef.current[i] = el;
                }}
              />
            ))}
          </div>
          <button
            onClick={verifyOTP}
            disabled={isVerifying}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button onClick={() => sendOtp()} className="cursor-pointer">
            6 оронтой тоо илгээх
          </Button>
          <div className="">
            &quot;6 оронтой тоо илгээх&quot; товчин дээр дарснаар таны имайл рүү
            6 оронтой тоо явуулж тэрийг та энд оруулснаар таны гүйлгээний нууцыг
            автоматаар хоослох болно. Та гүйлгээний нууц үгээ даруй солиорой.
          </div>
        </div>
      )}
    </>
  );
}
