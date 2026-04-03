"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const content = formData.get("content") as string;
  const isPublicStr = formData.get("isPublic");
  const isPublic = isPublicStr === "true";
  const image = formData.get("image") as string;

  console.log("----- CREATE POST DEBUG -----");
  console.log("Raw isPublic string:", isPublicStr);
  console.log("Parsed isPublic boolean:", isPublic);
  console.log("-----------------------------");

  if (!content) throw new Error("Content is required");

  await prisma.post.create({
    data: {
      content,
      isPublic,
      image,
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
}

export async function toggleLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existingLike = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.postLike.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
  }

  revalidatePath("/");
}

export async function getPosts() {
  return await prisma.post.findMany({
    where: {
      OR: [
        { isPublic: true },
        // Private posts of the current user could be added here if session were available
      ],
    },
    include: {
      author: true,
      likes: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
