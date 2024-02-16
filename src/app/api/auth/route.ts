import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import getCompany from "@/actions/company/getCompany";

export async function POST(req: NextRequest) {
  const { email, password, firstname, lastname, phoneNumber } =
    await req.json();
  console.log(email, password, firstname, lastname, phoneNumber);
  if (!email || !password) {
    return new NextResponse("Missing email or password", { status: 400 });
  }

  // check if user already exist
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

  // create user
  const newUser = await prismadb.user.create({
    data: {
      email: email,
      password: bcrypt.hashSync(password, 10),
      firstName: firstname,
      lastName: lastname,
      phone_number: phoneNumber,
    },
  });

  if (!newUser) {
    return new NextResponse("Error creating user", { status: 500 });
  }

  return new NextResponse("User created", {
    status: 200,
  });
}
