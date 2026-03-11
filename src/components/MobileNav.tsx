import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Brands", path: "/brands" },
  { label: "About", path: "/about" },
];

const WHATSAPP_URL = "https://wa.me/923167530204";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-5 py-4">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-display text-xs font-semibold text-primary">B</span>
          </div>
          <span className="text-display text-base font-light tracking-[0.15em] text-foreground">BBB</span>
        </Link>

        <div className="flex items-center gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <MessageCircle className="w-4 h-4" />
          </a>
          <button onClick={() => setIsOpen(!isOpen)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground">
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="px-5 pb-6 flex flex-col gap-2 bg-background/95 backdrop-blur-xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-display text-base tracking-[0.08em] transition-all px-4 py-2.5 rounded-xl ${
                location.pathname === item.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default MobileNav;
