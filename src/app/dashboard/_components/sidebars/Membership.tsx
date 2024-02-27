// import { OrganizationMembershipResource } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

export const Membership = ({
  id,
  alt,
  name,
  image,
}: {
  id: string;
  name: string;
  alt: string;
  image: string;
}) => {
  const { setActive } = useOrganizationList();

  const data = useOrganization();

  const isCurrentOrganization = data.organization?.id === id;

  const onClick = () => {
    if (!setActive) return;

    setActive({ organization: id });
  };

  return (
    <div className="relative pl-4 pr-3 group">
      <div
        onClick={onClick}
        className={cn(
          "relative w-10 h-10 rounded-md overflow-hidden cursor-pointer opacity-90 group-hover:opacity-100",
          isCurrentOrganization && "opacity-100"
        )}
      >
        <Image
          src={image}
          alt={alt}
          className="object-cover object-center rounded-md"
          fill
        />
      </div>

      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-3 bg-zinc-500 rounded-r-lg group-hover:h-7 transition-all",
          isCurrentOrganization && "h-7"
        )}
      />
    </div>
  );
};
