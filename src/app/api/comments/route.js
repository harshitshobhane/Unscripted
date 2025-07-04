import { getAuthSession } from "../../../utils/auth";
import prisma from "../../../utils/connect";
import { NextResponse } from "next/server";

// GET ALL COMMENTS OF A POST (with children)
export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const postSlug = searchParams.get("postSlug");
  try {
    // Helper to recursively fetch children with user
    async function fetchChildren(parentId) {
      const children = await prisma.comment.findMany({
        where: { parentId },
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      });
      // Recursively fetch children for each child
      for (let child of children) {
        child.children = await fetchChildren(child.id);
      }
      return children;
    }

    // Get all top-level comments for the post
    const comments = await prisma.comment.findMany({
      where: {
        ...(postSlug && { postSlug }),
        parentId: null,
      },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    // Recursively attach children with user for each top-level comment
    for (let comment of comments) {
      comment.children = await fetchChildren(comment.id);
    }
    return new NextResponse(JSON.stringify(comments, null, 2), { status: 200 });
  } catch (err) {
    console.error("[GET /api/comments]", err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!", error: err.message }), { status: 500 });
  }
};

// CREATE A COMMENT (or reply)
export const POST = async (req) => {
  const session = await getAuthSession();
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
  }
  try {
    const body = await req.json();
    // Accept parentId for replies
    const data = {
      ...body,
      userEmail: session.user.email,
      votes: [],
      parentId: body.parentId || null,
    };
    const comment = await prisma.comment.create({ data });
    return new NextResponse(JSON.stringify(comment, null, 2), { status: 200 });
  } catch (err) {
    console.error("[POST /api/comments]", err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!", error: err.message }), { status: 500 });
  }
};

// DELETE A COMMENT
export const DELETE = async (req) => {
  const session = await getAuthSession();
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
  }
  try {
    const { id } = await req.json();
    // Find the comment to check ownership
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return new NextResponse(JSON.stringify({ message: "Comment not found!" }), { status: 404 });
    }
    if (comment.userEmail !== session.user.email) {
      return new NextResponse(JSON.stringify({ message: "Not authorized!" }), { status: 403 });
    }
    // Helper to recursively delete all child comments
    async function deleteChildren(parentId) {
      const children = await prisma.comment.findMany({ where: { parentId } });
      for (let child of children) {
        await deleteChildren(child.id);
        await prisma.comment.delete({ where: { id: child.id } });
      }
    }
    await deleteChildren(id);
    await prisma.comment.delete({ where: { id } });
    return new NextResponse(JSON.stringify({ message: "Comment and all replies deleted." }), { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/comments]", err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!", error: err.message }), { status: 500 });
  }
};

// PATCH (upvote/downvote a comment)
export const PATCH = async (req) => {
  try {
    const session = await getAuthSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), { status: 401 });
    }
    const { id, delta } = await req.json();
    console.log('PATCH id:', id, 'delta:', delta);
    if (!id || typeof delta !== 'number') {
      return new NextResponse(JSON.stringify({ message: "Invalid request." }), { status: 400 });
    }
    // Find the comment
    const comment = await prisma.comment.findUnique({ where: { id } });
    console.log('Found comment:', comment);
    if (!comment) {
      return new NextResponse(JSON.stringify({ message: "Comment not found!" }), { status: 404 });
    }
    const userEmail = session.user.email;
    let newVotes = Array.isArray(comment.votes) ? [...comment.votes] : [];
    const existingVoteIdx = newVotes.findIndex(v => v.email === userEmail);
    if (existingVoteIdx !== -1) {
      if (newVotes[existingVoteIdx].value === delta) {
        // Undo vote
        newVotes.splice(existingVoteIdx, 1);
        console.log('Vote undone for user:', userEmail);
      } else {
        // Switch vote
        newVotes[existingVoteIdx].value = delta;
        console.log('Vote switched for user:', userEmail, 'to', delta);
      }
    } else {
      // Add new vote
      newVotes.push({ email: userEmail, value: delta });
      console.log('Vote added for user:', userEmail, 'value:', delta);
    }
    const updated = await prisma.comment.update({
      where: { id },
      data: {
        votes: newVotes,
      },
    });
    return new NextResponse(JSON.stringify(updated, null, 2), { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/comments]", err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!", error: err.message }), { status: 500 });
  }
};
