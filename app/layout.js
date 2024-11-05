
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import "./globals.css"; // Tailwind setup

export const metadata = {
  title: "ProgCast",
  description:
    "ProgCast is a website where you can learn programming using sound and files manager, where you can browse code files and listen to your podcaster offline or live",
};

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex min-h-screen font-Edu">
        {/* Sidebar fixed on the left */}
        <Sidebar />
        <div className="flex-grow flex flex-col">
          {/* Navbar at the top */}
          <Navbar />
          {/* Main content area */}
          <main className="flex-grow p-8 bg-gray-100 ml-64">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
