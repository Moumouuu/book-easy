import { createBooking } from "@/actions/company/createBooking";
import { getBookings } from "@/actions/company/getBookings";
import getUser from "@/actions/user/getUser";

interface IGet {
  params: {
    companyId: string;
  };
}

export async function GET(request: Request, { params }: IGet) {
  const companyId = params.companyId;

  if (!companyId)
    return new Response("The company ID is invalid!", { status: 400 });

  // get the current user from the session
  const currentUser = await getUser();

  if (!currentUser)
    return new Response("You must be logged in to access this resource!", {
      status: 401,
    });

  const books = await getBookings(companyId);

  return new Response(JSON.stringify(books), { status: 200 });
}

export async function POST(request: Request, { params }: IGet) {
  const companyId = params.companyId;

  if (!companyId)
    return new Response("The company ID is invalid!", { status: 400 });

  // get the current user from the session
  const currentUser = await getUser();

  if (!currentUser)
    return new Response("You must be logged in to access this resource!", {
      status: 401,
    });

  const body = await request.json();

  // create a new booking
  const newBooking = await createBooking(companyId, body);

  return new Response(JSON.stringify(newBooking), { status: 201 });
}
