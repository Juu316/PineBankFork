"use client";
import React, { Suspense } from "react";
import { TabsDemo } from "./_components/Tabs";

const Page = () => {
  return (
    <div className="flex gap-10 justify-center min-h-screen h-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <TabsDemo />
      </Suspense>
    </div>
  );
};

export default Page;
