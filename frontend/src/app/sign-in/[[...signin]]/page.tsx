"use client";

import { SignIn } from "@clerk/nextjs";

const LoginPage = () => {
  return (
    <>
      <div className="h-full min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-700 via-green-800 to-gray-900">
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Welcome to PineBank
          </h1>

          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            appearance={{
              variables: {
                colorPrimary: "#4CAF50", // PineBank's green theme
                colorBackground: "#FFFFFF",
                colorText: "#343C6A",
                colorTextSecondary: "#718EBF",
              },
              elements: {
                card: "shadow-md border border-gray-200 dark:border-gray-700",
                formButtonPrimary:
                  "bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg",
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
