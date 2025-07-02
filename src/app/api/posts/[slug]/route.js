import prisma from "../../../../utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "../../../../utils/auth";

// GET SINGLE POST
export const GET = async (req, { params }) => {
  const { slug } = params;

  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: { user: true },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// DELETE POST
export const DELETE = async (req, { params }) => {
  const session = await getAuthSession();
  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }
  const { slug } = params;
  try {
    // Only allow deleting if the user owns the post
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found!" }, { status: 404 })
      );
    }
    if (post.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized!" }, { status: 403 })
      );
    }
    await prisma.post.delete({ where: { slug } });
    return new NextResponse(
      JSON.stringify({ message: "Post deleted!" }, { status: 200 })
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
