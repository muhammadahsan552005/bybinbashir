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
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-5 py-4">
        <Link to="/" onClick={() => setIsOpen(false)}>
          <h1 className="text-display text-xl font-light tracking-[0.2em] text-foreground">BBB</h1>
        </Link>

        <div className="flex items-center gap-4">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-primary">
            <MessageCircle className="w-5 h-5" />
          </a>
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="px-5 pb-6 flex flex-col gap-4 bg-background border-b border-border">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-display text-lg tracking-[0.1em] transition-colors ${
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
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
