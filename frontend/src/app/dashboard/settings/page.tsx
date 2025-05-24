"use client";

import React, { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/validation/profileSchema";
import { useAuth } from "@clerk/nextjs";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useUser as useAppUser } from "@/context/userContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { updateUserProfile } from "@/lib/profileActions";
import { CurrentUser } from "@/context/currentUserContext";
import { getUserProfile } from "@/lib/api";
import { useSidebar } from "@/context/sidebarContext";
import { axiosInstance } from "@/lib/addedAxiosInstance";
const ProfilePage = () => {
  const { setSelectedSidebar } = useSidebar();
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getToken } = useAuth();
  const router = useRouter();
  const { user } = useClerkUser();
  const { userId } = useAppUser();
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("Token is null");
        }
        const profile = await getUserProfile(token);
        setProfileId(profile.id);
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setPhone(profile.phone);
        setAddress(profile.address);
      } catch (error) {
        console.error(
          "Error fetching profile data:",
          error instanceof Error ? error.message : error
        );
        setError("Failed to fetch profile data.");
      }
    };
    fetchProfileData();
  }, [getToken, userId]);

  const handleContinue = () => {
    const result = profileSchema.safeParse({
      firstName,
      lastName,
      phone,
      address,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setFirstNameError(fieldErrors.firstName?.[0] || "");
      setLastNameError(fieldErrors.lastName?.[0] || "");
      setPhoneError(fieldErrors.phone?.[0] || "");
      setAddressError(fieldErrors.address?.[0] || "");
      return false;
    }

    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
    setAddressError("");
    return true;
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = handleContinue();
    if (!isValid) return;

    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError("No token available");
        return;
      }

      if (!profileId) {
        setError("Profile ID is missing.");
        return;
      }

      const result = await updateUserProfile(profileId, token, {
        phone,
        address,
      });

      if (result.success) {
        toast("🅿 Амжилттай", {
          position: "bottom-left",
          autoClose: 5000,
        });
        router.push("/dashboard");
        setSelectedSidebar("Эхлэл");
      } else {
        setError(result.message || "Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const context = useContext(CurrentUser);
  const currentUserData = context?.currentUserData;
  const currentTransactionPassword = currentUserData?.transactionPassword;
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
    // Regex to check for at least one number and one letter and 8-20 characters
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
    const value = (e.target as HTMLInputElement).value;
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
      oldPasswordMatchingError == "" &&
      matchingError == "" &&
      validatingError == "" &&
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
  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-8 bg-gray-100 dark:bg-gray-950">
      <div className="relative z-10 w-full max-w-3xl shadow-md rounded-lg p-6 bg-white dark:bg-gray-900 backdrop-blur-md">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Тохиргоо</TabsTrigger>
            <TabsTrigger value="transactionPassword">
              Гүйлгээний нууц үг
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactionPassword">
            <div className="">
              <div className="w-full flex flex-col gap-6">
                <div className=" text-lg font-medium">
                  Гүйлгээний нууц үг өөрчлөх
                </div>
                <div
                  className={`flex justify-between items-center rounded-md w-1/2 min-w-[240px] border h-[2.25rem] px-2 ${
                    oldPasswordMatchingError
                      ? "border-[#ef4444] border-opacity-50"
                      : "border-gray-300"
                  }`}>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className={`w-full focus:outline-0 `}
                    placeholder="Хуучин нууц үг"
                    value={typedCurrentPassword}
                    onChange={(e) => {
                      handleTypedCurrentPassword(e);
                    }}
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
                    className={`w-full focus:outline-0 `}
                    placeholder="Шинэ нууц үг"
                    onChange={(e) => {
                      handlePasswordChange(e);
                    }}
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
                    className={`w-full focus:outline-0 `}
                    placeholder="Шинэ нууц үг давтах"
                    type={isPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {validatingError && (
                  <p className="text-red-600">{validatingError}</p>
                )}
                {matchingError && (
                  <p className="text-red-600">{matchingError}</p>
                )}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={(e) => setIsPasswordVisible(e.target.checked)}
                  />
                  <span className="ml-2">Нууц үг харуулах</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      handlePasswordUpdate();
                    }}
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
            </div>
          </TabsContent>
          <TabsContent value="profile">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="text-black dark:text-white text-xl font-medium">
                Тавтай морилно уу, {user?.username}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                  Овог
                </label>
                <Input
                  className="w-full text-black dark:text-white bg-transparent border dark:border-gray-700"
                  type="text"
                  placeholder="Овог оруулна уу"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {firstNameError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <X className="mr-1 h-4 w-4" />
                    {firstNameError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                  Нэр
                </label>
                <Input
                  className="w-full text-black dark:text-white bg-transparent border dark:border-gray-700"
                  type="text"
                  placeholder="Нэр оруулна уу"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {lastNameError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <X className="mr-1 h-4 w-4" />
                    {lastNameError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                  Хаяг
                </label>
                <textarea
                  className="w-full text-black dark:text-white bg-transparent border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700"
                  placeholder="Хаягаа оруулна уу"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {addressError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <X className="mr-1 h-4 w-4" />
                    {addressError}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  type="tel"
                  id="floating-phone-number"
                  className="block py-2.5 pl-6 w-full text-sm text-black dark:text-white bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                />
                <label
                  htmlFor="floating-phone-number"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:pl-6 peer-focus:pl-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Утасны дугаар
                </label>
              </div>

              {phoneError && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <X className="mr-1 h-4 w-4" />
                  {phoneError}
                </p>
              )}

              <div className="flex justify-center">
                <Button
                  className="w-[246px] h-[40px] mt-2"
                  type="submit"
                  disabled={loading}>
                  Хадгалах
                </Button>
              </div>

              {loading && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  ...loading
                </p>
              )}
              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
