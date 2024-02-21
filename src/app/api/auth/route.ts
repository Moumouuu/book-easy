import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

interface RequestData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  fromInvite: {
    email: string;
    token: string;
    company: string;
  };
}

export async function POST(req: NextRequest) {
  const {
    email,
    password,
    firstname,
    lastname,
    phoneNumber,
    fromInvite,
  }: RequestData = await req.json();

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

  if (fromInvite.email) {
    // check if token is valid
    await prismadb.user.findUniqueOrThrow({
      where: {
        id: fromInvite.token,
      },
    });
    // check if user is already in company
    await prismadb.company.findFirstOrThrow({
      where: {
        userRoles: {
          some: {
            userId: fromInvite.token,
          },
        },
      },
    });
    // check if company exist
    await prismadb.company.findFirstOrThrow({
      where: {
        id: fromInvite.company,
      },
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

  // create userRole if fromInvite and add user to company
  if (fromInvite.email && newUser) {
    const userRole = await prismadb.userCompanyRole.create({
      data: {
        role: "USER",
        company: {
          connect: {
            id: fromInvite.company,
          },
        },
        user: {
          connect: {
            id: newUser.id,
          },
        },
      },
    });
    if (!userRole) {
      return new NextResponse("Error creating user role", { status: 500 });
    }
  }

  if (!newUser) {
    return new NextResponse("Error creating user", { status: 500 });
  }

  return new NextResponse("User created", {
    status: 200,
  });
}
