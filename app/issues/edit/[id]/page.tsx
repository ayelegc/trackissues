import { notFound } from "next/navigation";
import IssueForm from "../../_components/IssueForm";
import { prisma } from "@/prisma/client";
import { FC } from "react";

interface Props {
  params: { id: string };
}

const EditIssuePage: FC<Props> = async ({ params }) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!issue) {
    notFound();
  }

  return <IssueForm issue={issue} />;
};

export default EditIssuePage;
