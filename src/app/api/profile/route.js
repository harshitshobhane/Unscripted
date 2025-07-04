import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { bio: true },
  });
  return new Response(JSON.stringify({ bio: user?.bio || "" }), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const { bio } = await req.json();
  await prisma.user.update({
    where: { email: session.user.email },
    data: { bio },
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 