"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addComment(postId: string, content: string, parentId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!content) throw new Error("Content is required");

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
      parentId: parentId || null,
    },
  });

  revalidatePath("/");
}

export async function toggleCommentLike(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId: session.user.id,
        commentId,
      },
    },
  });

  if (existingLike) {
    await prisma.commentLike.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.commentLike.create({
      data: {
        userId: session.user.id,
        commentId,
      },
    });
  }

  revalidatePath("/");
}
