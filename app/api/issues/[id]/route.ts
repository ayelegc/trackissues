import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/prisma/client";
import { patchIssueSchema } from "@/validationSchemas";

// 🔄 PATCH /api/issues/:id — Update Issue
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const issueId = parseInt(params.id);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
  }

  const body = await request.json();
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { title, description, assignedToUserId } = body;

  try {
    const existing = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: { title, description, assignedToUserId },
    });

    return NextResponse.json(updatedIssue);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 🗑️ DELETE /api/issues/:id — Delete Issue
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const issueId = parseInt(params.id);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
  }

  try {
    const existing = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    await prisma.issue.delete({
      where: { id: issueId },
    });

    return NextResponse.json({ message: "Issue deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
