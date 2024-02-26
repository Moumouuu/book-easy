import { Metadata } from "next";
import Aside from "./(routes)/_components/aside";
import CompanyProvider from "@/providers/company-provider";

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
  return (
    <body className="flex flex-col lg:flex-row">
      <Aside />
      <CompanyProvider>
        <div className="flex w-full flex-col">{children}</div>
      </CompanyProvider>
    </body>
  );
}
