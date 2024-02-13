import { Metadata } from "next";
import Aside from "./(routes)/_components/aside";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: "BookEasy - DashBoard",
  description:
    "Faciliter la gestion des réservations pour les entreprises, en particulier dans les secteurs tels que la restauration, les salons de beauté, les activités de loisirs,",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <body className="flex flex-col lg:flex-row">
      <AuthProvider session={session}>
        <Aside />
        {children}
      </AuthProvider>
    </body>
  );
}
