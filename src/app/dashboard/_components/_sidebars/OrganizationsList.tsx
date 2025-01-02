"use client";
import React from "react";

import { useOrganizationList } from "@clerk/nextjs";
import { Membership } from "./Membership";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OrganizationsList = () => {
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!isLoaded || userMemberships.isLoading) {
    return (
      <div className="pr-3 pl-4">
        <Button className="bg-slate-700 pointer-events-none w-10 h-10 p-0">
          <Loader2 className="w-5 h-5 flex justify-center text-slate-200 animate-spin" />
        </Button>
      </div>
    );
  }

  if (!userMemberships?.data || !(userMemberships.data.length > 0)) return null;

  return (
    <div className="flex flex-col gap-4">
      {userMemberships.data.map((membership, i) => (
        <Membership
          image={membership.organization.imageUrl}
          name={membership.organization.name}
          id={membership.organization.id}
          alt="Organization Image"
          key={i}
        />
      ))}
    </div>
  );
};
