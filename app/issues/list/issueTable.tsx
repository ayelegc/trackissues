import { IssueStatusBadge } from "@/components";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import { Issue, Status } from "@prisma/client";

export interface IssueQuery {
  status?: Status;
  orderBy?: keyof Issue;
  order?: "asc" | "desc";
  page?: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  return searchParams.toString();
};

const IssueTable = ({ searchParams, issues }: Props) => {
  const order = searchParams.order === "desc" ? "desc" : "asc";

  return (
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
            } as unknown as Record<string, string | undefined>);

            return (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <Link
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
                </Link>
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
  );
};
const columns: {
  label: string;
  value: keyof Issue;
  className?: string;
}[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
];
export const columnsNames = columns.map((column) => column.value);
export default IssueTable;
