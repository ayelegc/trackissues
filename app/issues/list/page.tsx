import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "../../components";
import NextLink from "next/link";
import IssueAction from "./IssueAction";
import { Status, Issue } from "@/generated/prisma/client";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { prisma } from "@/prisma/client";

interface Props {
  searchParams:
    | Promise<Record<string, string | undefined>>
    | Record<string, string | undefined>;
}

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  return searchParams.toString();
};

const IssuesPage = async ({ searchParams }: Props) => {
  searchParams = await searchParams;

  const columns: {
    label: string;
    value: keyof Issue;
    className?: string;
  }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status as Status)
    ? (searchParams.status as Status)
    : undefined;

  const orderBy = searchParams.orderBy || "createdAt";
  const order: "asc" | "desc" = searchParams.order === "desc" ? "desc" : "asc";

  const issues = await prisma.issue.findMany({
    where: status ? { status } : undefined,
    orderBy: {
      [orderBy]: order,
    },
  });

  return (
    <div>
      <IssueAction />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => {
              const isActive = searchParams.orderBy === column.value;
              const nextOrder = isActive && order === "asc" ? "desc" : "asc";

              const queryString = buildQueryString({
                ...searchParams,
                orderBy: column.value,
                order: nextOrder,
              });

              return (
                <Table.ColumnHeaderCell
                  key={column.value}
                  className={column.className}
                >
                  <NextLink
                    href={`/issues/list?${queryString}`}
                    className="hover:underline flex items-center"
                  >
                    {column.label}
                    {isActive &&
                      (order === "asc" ? (
                        <ArrowUpIcon className="inline" />
                      ) : (
                        <ArrowDownIcon className="inline" />
                      ))}
                  </NextLink>
                </Table.ColumnHeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length}>No issues found.</Table.Cell>
            </Table.Row>
          ) : (
            issues.map((issue) => (
              <Table.Row key={issue.id}>
                <Table.Cell>
                  <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                  <div className="block md:hidden">
                    <IssueStatusBadge status={issue.status} />
                  </div>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <IssueStatusBadge status={issue.status} />
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  {issue.createdAt.toDateString()}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export const dynamic = "force-dynamic";
export default IssuesPage;
