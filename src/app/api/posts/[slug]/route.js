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

    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};

// DELETE POST
export const DELETE = async (req, { params }) => {
  const session = await getAuthSession();
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
  }
  const { slug } = params;
  try {
    // Only allow deleting if the user owns the post
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Post not found!" }), { status: 404 });
    }
    if (post.userEmail !== session.user.email) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized!" }), { status: 403 });
    }
    await prisma.post.delete({ where: { slug } });
    return new NextResponse(JSON.stringify({ message: "Post deleted!" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};

// PATCH (like/dislike a post)
export const PATCH = async (req, { params }) => {
  const session = await getAuthSession();
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
  }
  const { slug } = params;
  try {
    const { value } = await req.json(); // 1 for like, -1 for dislike
    if (![1, -1].includes(value)) {
      return new NextResponse(JSON.stringify({ message: "Invalid value." }), { status: 400 });
    }
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Post not found!" }), { status: 404 });
    }
    let blogVotes = Array.isArray(post.blogVotes) ? [...post.blogVotes] : [];
    const userEmail = session.user.email;
    const existingVoteIdx = blogVotes.findIndex(v => v.email === userEmail);
    if (existingVoteIdx !== -1) {
      if (blogVotes[existingVoteIdx].value === value) {
        // Undo vote
        blogVotes.splice(existingVoteIdx, 1);
      } else {
        // Switch vote
        blogVotes[existingVoteIdx].value = value;
      }
    } else {
      // Add new vote
      blogVotes.push({ email: userEmail, value });
    }
    const updated = await prisma.post.update({
      where: { slug },
      data: { blogVotes },
    });
    // Calculate counts
    const likeCount = updated.blogVotes.filter(v => v.value === 1).length;
    const dislikeCount = updated.blogVotes.filter(v => v.value === -1).length;
    return new NextResponse(JSON.stringify({ likeCount, dislikeCount, blogVotes: updated.blogVotes }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};
