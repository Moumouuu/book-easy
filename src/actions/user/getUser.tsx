import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";

export default async function getUser() {
  const currentUser = await getServerSession(authOptions);

  if (!currentUser?.user?.email) {
    return null;
  }

  const user = prismadb.user.findUnique({
    where: {
      email: currentUser?.user?.email,
    },
  });

  return user ?? null;
}
