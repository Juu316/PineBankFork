"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useUser as useAppUser } from "@/context/userContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { updateUserProfile } from "@/lib/profileActions";
import { CurrentUser } from "@/context/currentUserContext";
import { getUserProfile } from "@/lib/api";
import { useSidebar } from "@/context/sidebarContext";
import { ProfileForm } from "./_components/profileForm";
import { PasswordForm } from "./_components/transactionPassword";
import { profileSchema } from "@/validation/profileSchema";
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
            <PasswordForm
              currentTransactionPassword={currentTransactionPassword}
              userId={userId ?? undefined}
              getToken={getToken}
            />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileForm
              firstName={firstName}
              setFirstName={setFirstName}
              firstNameError={firstNameError}
              lastName={lastName}
              setLastName={setLastName}
              lastNameError={lastNameError}
              phone={phone}
              setPhone={setPhone}
              phoneError={phoneError}
              address={address}
              setAddress={setAddress}
              addressError={addressError}
              loading={loading}
              error={error}
              handleProfileUpdate={handleProfileUpdate}
              username={user?.username ?? undefined}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
