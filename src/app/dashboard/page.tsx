import React from "react";
import { Sidebar } from "./_components/sidebars/Sidebar";
import { OrganizationSidebar } from "./_components/sidebars/OrganizationSidebar";
import { Navbar } from "./_components/Navbar";
import { Dashboard } from "./_components/Dashboard";

const DashboardPage = () => {
  return (
    <main className="h-full ">
      <div className="flex h-full pl-[68px]">
        <Sidebar />
        <OrganizationSidebar />

        <div className="flex-1 flex flex-col lg:pl-[256px]">
          <Navbar />

          <Dashboard />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
