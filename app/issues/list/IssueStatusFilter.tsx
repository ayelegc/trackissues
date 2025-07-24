"use client";

import { Status } from "../../generated/prisma/client"; // Adjust the path as necessary
import { Select } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";

type ExtendedStatus = Status | "ALL";

const statuses: { label: string; value: ExtendedStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const IssueStatusFilter = () => {
  const router = useRouter();

  const handleStatusChange = (status: string) => {
    const query = status ? `?status=${status}` : "";
    router.push("/issues/list" + query);
  };

  return (
    <Select.Root onValueChange={handleStatusChange}>
      <Select.Trigger placeholder="Filter By Status..." />
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item key={status.value} value={status.value}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
