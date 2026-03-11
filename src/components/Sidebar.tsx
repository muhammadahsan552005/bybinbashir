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
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col justify-between bg-card/50 backdrop-blur-xl z-50 px-8 py-10 border-r border-border/50">
      {/* Logo */}
      <div>
        <Link to="/" className="block mb-14">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-display text-lg font-semibold text-primary tracking-wider">B</span>
            </div>
            <div>
              <h1 className="text-display text-xl font-light tracking-[0.15em] text-foreground">
                BBB
              </h1>
              <p className="font-body text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                ByBinBashir
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-display text-base tracking-[0.08em] transition-all duration-300 px-4 py-2.5 rounded-xl ${
                location.pathname === item.path
                  ? "text-primary bg-primary/10 border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
        className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="font-body text-sm">Order on WhatsApp</span>
      </a>
    </aside>
  );
};

export default Sidebar;
