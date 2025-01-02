"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { EditModel } from "@/modals/EditModel";
import { DeleteBoardModal } from "@/modals/DeleteBoardModal";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <EditModel />
      <DeleteBoardModal />
    </>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#f43f5e" },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ModalsProvider />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
