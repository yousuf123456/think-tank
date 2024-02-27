import React from "react";
import { OrganizationsList } from "./OrganizationsList";
import { AddNewOrganization } from "./AddNewOrganization";

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 py-6 bg-black h-full w-[68px]">
      <div className="flex flex-col gap-8">
        <OrganizationsList />
        <AddNewOrganization />
      </div>
    </aside>
  );
};
