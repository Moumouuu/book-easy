import getUser from "@/actions/user/getUser";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();

  if (!user) return new NextResponse("User not found", { status: 404 });

  const books = await prismadb.book.findMany({
    where: { createdById: user.id },
    orderBy: { created_at: "asc" },
    select: {
      company: {
        select: {
          name: true,
          address: true,
        }
      },
      id: true,
      price: true,
      start_at: true,
      end_at: true,
    },
  });

  return new NextResponse(JSON.stringify(books), { status: 200 });
}
