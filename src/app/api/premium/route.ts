import getUser from "@/actions/user/getUser";
import prismadb from "@/lib/prismadb";

export async function GET() {
  const user = await getUser();
  if (!user)
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });

  const isPremium = await prismadb.premiumUser.findFirst({
    where: { userId: user.id },
  });

  return new Response(JSON.stringify(isPremium ? true : false), {
    status: 200,
  });
}
