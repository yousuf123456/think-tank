import React, { Suspense } from "react";
import { Sidebar } from "./_components/_sidebars/Sidebar";
import { OrganizationSidebar } from "./_components/_sidebars/OrganizationSidebar";
import { Navbar } from "./_components/Navbar";
import { Dashboard } from "./_components/Dashboard";

export default function DashboardPage() {
  return (
    <main className="h-full ">
      <div className="flex h-full pl-[68px]">
        <Sidebar />
        <OrganizationSidebar />

        <div className="flex-1 flex flex-col lg:pl-[256px]">
          <Navbar />

          {/* To use useSearchParams, we have to wrap the component in Suspense boundary */}
          <Suspense>
            <Dashboard />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
