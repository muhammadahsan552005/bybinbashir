import { Link, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Brands", path: "/brands" },
  { label: "About", path: "/about" },
];

const WHATSAPP_URL = "https://wa.me/923167530204";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col justify-between border-r border-border bg-background z-50 px-8 py-10">
      {/* Logo */}
      <div>
        <Link to="/" className="block mb-16">
          <h1 className="text-display text-3xl font-light tracking-[0.2em] text-foreground">
            BBB
          </h1>
          <p className="text-brand text-[10px] tracking-[0.15em] text-muted-foreground mt-1">
            BYBINBASHIR
          </p>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-display text-lg tracking-[0.1em] transition-colors duration-300 ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="font-body text-sm">Order on WhatsApp</span>
      </a>
    </aside>
  );
};

export default Sidebar;
