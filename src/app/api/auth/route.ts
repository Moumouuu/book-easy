import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new NextResponse("Missing email or password", { status: 400 });
  }

  const userAlreadyExist = await prismadb.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userAlreadyExist) {
    return NextResponse.json({
      error: "User already exist",
    });
  }

  const newUser = await prismadb.user.create({
    data: {
      email: email,
      password: bcrypt.hashSync(password, 10),
    },
  });

  if (!newUser) {
    return new NextResponse("Error creating user", { status: 500 });
  }

  return new NextResponse("User created", {
    status: 200,
  });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const user = await prismadb.user.findUnique({
    where: {
      email: String(email),
    },
  });
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  return new NextResponse(JSON.stringify(user));
}
