import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-hidden">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
