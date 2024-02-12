import { Metadata } from "next";
import UserAuthForm from "./_components/form/form-auth-user";

export const metadata: Metadata = {
  title: "BookEasy | Autentification ",
  description: "Page d'autentification de l'application BookEasy",
};

export default function AuthenticationPage() {
  return <UserAuthForm />;
}
