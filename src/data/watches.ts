import watchRolex from "@/assets/watch-rolex.jpg";
import watchHublot from "@/assets/watch-hublot.jpg";
import watchTissot from "@/assets/watch-tissot.jpg";
import watchCartier from "@/assets/watch-cartier.jpg";
import watchTimas from "@/assets/watch-timas.jpg";
import watchAura from "@/assets/watch-aura.jpg";

export interface Watch {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroColor: string;
  image: string;
}

export const brands: Brand[] = [
  {
    id: "1",
    name: "Rolex",
    slug: "rolex",
    description: "The crown jewel of watchmaking. Rolex represents the pinnacle of precision engineering and timeless design, a symbol of achievement recognized across the globe.",
    heroColor: "from-emerald-950/40",
    image: watchRolex,
  },
  {
    id: "2",
    name: "Hublot",
    slug: "hublot",
    description: "The art of fusion. Hublot pushes boundaries with bold, avant-garde designs that merge traditional Swiss craftsmanship with cutting-edge materials and innovation.",
    heroColor: "from-slate-950/40",
    image: watchHublot,
  },
  {
    id: "3",
    name: "Tissot",
    slug: "tissot",
    description: "Swiss excellence since 1853. Tissot combines tradition and innovation, delivering refined timepieces that embody accessible luxury and exceptional quality.",
    heroColor: "from-blue-950/40",
    image: watchTissot,
  },
  {
    id: "4",
    name: "Cartier",
    slug: "cartier",
    description: "The jeweller of kings, the king of jewellers. Cartier's watchmaking legacy is defined by elegant forms and architectural precision that transcend time.",
    heroColor: "from-red-950/40",
    image: watchCartier,
  },
  {
    id: "5",
    name: "Timas",
    slug: "timas",
    description: "Contemporary sophistication meets accessible elegance. Timas delivers modern timepieces with clean lines and refined details for the discerning individual.",
    heroColor: "from-amber-950/40",
    image: watchTimas,
  },
  {
    id: "6",
    name: "Aura",
    slug: "aura",
    description: "Radiance redefined. Aura watches capture light and attention with rose gold warmth and minimalist design, perfect for those who appreciate understated beauty.",
    heroColor: "from-rose-950/40",
    image: watchAura,
  },
];

export const watches: Watch[] = [
  { id: "1", name: "Submariner Gold", brand: "Rolex", price: "PKR 8,500", image: watchRolex, description: "Classic gold Submariner with black dial. Water-resistant design with luminous markers." },
  { id: "2", name: "Big Bang Black", brand: "Hublot", price: "PKR 7,200", image: watchHublot, description: "Bold skeleton dial with rubber strap. Chronograph movement with modern aesthetics." },
  { id: "3", name: "PRX Powermatic", brand: "Tissot", price: "PKR 6,800", image: watchTissot, description: "Silver sunray dial with integrated bracelet. Swiss precision at its finest." },
  { id: "4", name: "Tank Must", brand: "Cartier", price: "PKR 7,500", image: watchCartier, description: "Iconic rectangular case with Roman numeral dial. Timeless elegance on leather." },
  { id: "5", name: "Classic Gold", brand: "Timas", price: "PKR 4,500", image: watchTimas, description: "Minimalist gold case with black dial. Clean lines for everyday sophistication." },
  { id: "6", name: "Rose Elegance", brand: "Aura", price: "PKR 5,200", image: watchAura, description: "Rose gold case with blush dial. A statement of quiet luxury and grace." },
  { id: "7", name: "Datejust Silver", brand: "Rolex", price: "PKR 9,000", image: watchRolex, description: "The quintessential Rolex. Fluted bezel with Jubilee bracelet and date window." },
  { id: "8", name: "Classic Fusion", brand: "Hublot", price: "PKR 6,500", image: watchHublot, description: "Sleek titanium case with satin-finished dial. Bold yet refined." },
  { id: "9", name: "Gentleman", brand: "Tissot", price: "PKR 5,800", image: watchTissot, description: "Versatile dress watch with automatic movement. From boardroom to evening." },
  { id: "10", name: "Santos de Cartier", brand: "Cartier", price: "PKR 8,200", image: watchCartier, description: "The watch that started it all. Square case with exposed screws." },
  { id: "11", name: "Sport Chrono", brand: "Timas", price: "PKR 4,800", image: watchTimas, description: "Sporty chronograph with tachymeter bezel. Performance meets style." },
  { id: "12", name: "Midnight Black", brand: "Aura", price: "PKR 5,500", image: watchAura, description: "All-black design with rose gold accents. For the night owl in you." },
];
