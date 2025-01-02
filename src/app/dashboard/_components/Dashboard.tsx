"use client";

import React from "react";
import { EmptyOrg } from "./_emptyStates/EmptyOrg";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { SelectOrg } from "./_emptyStates/SelectOrg";
import { Loading } from "./_emptyStates/Loading";
import { BoardsList } from "./BoardsList";
import { useSearchParams } from "next/navigation";

export const Dashboard = () => {
  const searchParams = useSearchParams();
  const fav = searchParams.get("fav") === "true";
  const q = searchParams.get("q");

  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  if (userMemberships.isLoading || !isLoaded || !isOrgLoaded) {
    return <Loading />;
  }

  if (!userMemberships.data || !(userMemberships.data.length > 0))
    return <EmptyOrg />;

  if (!organization) return <SelectOrg />;

  return (
    <BoardsList
      orgId={organization.id}
      query={{
        fav,
        q,
      }}
    />
  );
};
