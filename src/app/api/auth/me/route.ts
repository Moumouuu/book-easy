import getUser from "@/actions/user/getUser";
import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(JSON.stringify(await getUser()));
}
