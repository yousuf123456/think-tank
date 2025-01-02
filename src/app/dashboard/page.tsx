import React, { Suspense } from "react";
import { Navbar } from "./_components/Navbar";
import { Dashboard } from "./_components/Dashboard";

export default function DashboardPage() {
  return (
    <main className="h-full ">
      <div className="flex-1 flex flex-col gap-8">
        <Navbar />

        {/* To use useSearchParams, we have to wrap the component in Suspense boundary */}
        <Suspense>
          <Dashboard />
        </Suspense>
      </div>
    </main>
  );
}
