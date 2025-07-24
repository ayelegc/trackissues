// app/api/issues/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { prisma } from "@/prisma/client";
import { issueSchema } from "@/validationSchemas";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { title, description, assignedToUserId } = body;

  const newIssue = await prisma.issue.create({
    data: {
      title,
      description,
      assignedToUserId,
    },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
