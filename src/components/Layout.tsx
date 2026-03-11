import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      <main className="lg:ml-72 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
