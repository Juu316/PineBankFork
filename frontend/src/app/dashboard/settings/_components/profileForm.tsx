"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";


interface ProfileFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  firstNameError: string;
  lastName: string;
  setLastName: (value: string) => void;
  lastNameError: string;
  phone: string;
  setPhone: (value: string) => void;
  phoneError: string;
  address: string;
  setAddress: (value: string) => void;
  addressError: string;
  loading: boolean;
  error: string;
  handleProfileUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
  username?: string;
}

export const ProfileForm = ({
  firstName,
  setFirstName,
  firstNameError,
  lastName,
  setLastName,
  lastNameError,
  phone,
  setPhone,
  phoneError,
  address,
  setAddress,
  addressError,
  loading,
  error,
  handleProfileUpdate,
  username,
}: ProfileFormProps) => {
  return (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="text-black dark:text-white text-xl font-medium">
        Тавтай морилно уу, {username}
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
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </form>
  );
};
