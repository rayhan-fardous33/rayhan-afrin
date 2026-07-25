// app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogoutProvider } from "@/providers/LogoutProvider";
import PwaRegistration from "@/components/PwaRegistration";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "RayHan❁Afrin",
  description: "Lover....",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" data-theme="dark">
      <body
        className={`${poppins.className} min-h-full flex flex-col bg-[#050505] text-white`}
      >
        <LogoutProvider>{children}</LogoutProvider>
        <PwaRegistration />

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </body>
    </html>
  );
}
