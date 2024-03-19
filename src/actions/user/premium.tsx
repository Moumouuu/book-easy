import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";

export const checkSubscription = async () => {
  const data = await getServerSession();
  const userEmail = data?.user?.email;

  if (!userEmail) {
    return false;
  }

  const user = await prismadb.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user?.id) {
    return false;
  }

  const userSubscription = await prismadb.premiumUser.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSubscription) {
    return false;
  }

  return !!userSubscription;
};
