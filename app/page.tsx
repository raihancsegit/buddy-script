import React from "react";
import Header from "@/components/layout/Header";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";

export const dynamic = "force-dynamic";

async function getPosts(userId?: string, search?: string) {
  const whereClause: any = {
    OR: [
      { isPublic: true },
      ...(userId ? [{ authorId: userId }] : []),
    ],
  };

  if (search) {
    whereClause.AND = [
      {
        OR: [
          { content: { contains: search } },
          { id: { equals: search } },
          {
            author: {
              OR: [
                { name: { contains: search } },
                { firstName: { contains: search } },
                { lastName: { contains: search } },
              ],
            },
          },
        ],
      },
    ];
  }

  return await prisma.post.findMany({
    where: whereClause,
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true }
      },
      likes: {
        include: {
          user: true
        }
      },
      comments: {
        include: {
          author: true,
          likes: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function FeedPage(props: {
  searchParams: any;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search ? String(searchParams.search) : undefined;
  
  console.log("Feed Search Query:", search); // Debugging

  const session = await auth();
  const posts = await getPosts(session?.user?.id, search);

  console.log("----- PAGE LOAD DEBUG -----");
  console.log(`Current User ID: ${session?.user?.id}`);
  console.log(`Total Posts Fetched: ${posts.length}`);
  posts.forEach((p: any, i: number) => {
    if (i < 5) console.log(`Post ${p.id} | Author: ${p.authorId} | isPublic: ${p.isPublic}`);
  });
  console.log("---------------------------");

  return (
    <div className="_layout _layout_main_wrapper">
      <div className="_main_layout">
        <Header />
        
        <div className="container _custom_container" style={{ marginTop: "24px" }}>
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <SidebarLeft />
              </div>
              
              {/* Middle Content */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_content_wrap">
                  <CreatePost />
                  
                  <div className="_layout_middle_content_inner">
                    {posts.length === 0 && search && (
                      <div className="alert alert-info mt-3">No posts found matching your search.</div>
                    )}
                    {posts.map((post: any) => (
                      <PostCard key={post.id} post={post} currentUserId={session?.user?.id} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <SidebarRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
