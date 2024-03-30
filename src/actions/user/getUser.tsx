import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";

export default async function getUser() {
  const currentUser = await getServerSession(authOptions);

  if (!currentUser?.user?.email) {
    return null;
  }

  const user = await prismadb.user.findUnique({
    where: {
      email: currentUser?.user?.email,
    },
    select: {
      id: true,
      email: true,
      lastName: true,
      firstName: true,
      
      _count: {
        select: {
          companies: true,
        },
      },
    },
  });

  // if not user in database that means user is logged in with google
  return user ?? null;
}
