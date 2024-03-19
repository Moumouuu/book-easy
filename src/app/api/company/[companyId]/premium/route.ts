import getCompany from "@/actions/company/getCompany";
import { getTeamUsers } from "@/actions/company/getTeamUsers";
import getUser from "@/actions/user/getUser";
import prismadb from "@/lib/prismadb";

interface IGet {
  params: {
    companyId: string;
  };
}

export async function GET(request: Request, { params }: IGet) {
  const { companyId } = params;

  if (!companyId) return new Response("companyId is required", { status: 400 });

  const company = await getCompany(companyId);
  if (!company) return new Response("Company not found", { status: 404 });

  const user = await getUser();
  if (!user) return new Response("User not found", { status: 404 });

  // find all
  const members = await getTeamUsers(companyId);

  if (!members) return new Response("Members not found", { status: 404 });

  const premiumMember = await Promise.all(
    members.map(async (member: any) => {
      const memberIsPremium = await prismadb.premiumUser.findUnique({
        where: {
          userId: String(member.user.email),
        },
      });
      if (memberIsPremium) {
        return member;
      }
    })
  );

  const firstPremiumMember = premiumMember.find(
    (member) => member !== undefined
  );

  return new Response(JSON.stringify(!!firstPremiumMember), {
    status: 200,
  });
}
