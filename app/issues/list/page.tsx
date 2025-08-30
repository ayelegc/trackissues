import IssueAction from "./IssueAction";
import { Status, Issue } from "@prisma/client";
import { prisma } from "@/prisma/client";
import Paginaton from "../../components/Paginaton";
import IssueTable, { columnsNames } from "./issueTable";
import { IssueQuery } from "./issueTable";
import { Flex } from "@radix-ui/themes";

interface Props {
  searchParams: IssueQuery;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);

  const status = statuses.includes(searchParams.status as Status)
    ? (searchParams.status as Status)
    : undefined;

  const where = status ? { status } : {};
  const orderBy: keyof Issue = searchParams.orderBy || "createdAt";
  const order: "asc" | "desc" = searchParams.order === "desc" ? "desc" : "asc";

  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy: { [orderBy]: order },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <Flex direction="column" gap="3">
      <IssueAction />
      <IssueTable searchParams={searchParams} issues={issues} />
      {issues.length === 0 && (
        <p className="text-center text-gray-500">
          No issues found (showing {columnsNames.length} columns).
        </p>
      )}

      <Paginaton
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";
export default IssuesPage;
