import { FromGoogleDialog } from "./_components/fromGoogleDialog";
import getUser from "@/actions/user/getUser";

export default async function App() {
  const user = await getUser();
  return (
    <div className="flex">
      <FromGoogleDialog isOpen={user?.firstName ? false : true} />
      Bienvenue {user?.firstName}
    </div>
  );
}
