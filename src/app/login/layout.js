import Navbar from "@/components/Navbar";

export default function LoginLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-28">{children}</main>
    </>
  );
}
