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
  priceNum: number;
  code: string;
  image: string;
  images: string[];
  description: string;
  category: string;
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
  { id: "1", name: "Rolex", slug: "rolex", description: "The crown jewel of watchmaking. Rolex represents the pinnacle of precision engineering and timeless design, a symbol of achievement recognized across the globe.", heroColor: "from-emerald-950/40", image: watchRolex },
  { id: "2", name: "Hublot", slug: "hublot", description: "The art of fusion. Hublot pushes boundaries with bold, avant-garde designs that merge traditional Swiss craftsmanship with cutting-edge materials and innovation.", heroColor: "from-slate-950/40", image: watchHublot },
  { id: "3", name: "Tissot", slug: "tissot", description: "Swiss excellence since 1853. Tissot combines tradition and innovation, delivering refined timepieces that embody accessible luxury and exceptional quality.", heroColor: "from-blue-950/40", image: watchTissot },
  { id: "4", name: "Cartier", slug: "cartier", description: "The jeweller of kings, the king of jewellers. Cartier's watchmaking legacy is defined by elegant forms and architectural precision that transcend time.", heroColor: "from-red-950/40", image: watchCartier },
  { id: "5", name: "Timas", slug: "timas", description: "Contemporary sophistication meets accessible elegance. Timas delivers modern timepieces with clean lines and refined details for the discerning individual.", heroColor: "from-amber-950/40", image: watchTimas },
  { id: "6", name: "Aura", slug: "aura", description: "Radiance redefined. Aura watches capture light and attention with rose gold warmth and minimalist design, perfect for those who appreciate understated beauty.", heroColor: "from-rose-950/40", image: watchAura },
];

export const watches: Watch[] = [
  { id: "1", name: "Submariner Gold", brand: "Rolex", price: "PKR 8,500", priceNum: 8500, code: "RLX-SUB-001", image: watchRolex, images: [watchRolex, watchRolex], description: "Classic gold Submariner with black dial. Water-resistant design with luminous markers. Premium build quality with automatic movement.", category: "Luxury" },
  { id: "2", name: "Big Bang Black", brand: "Hublot", price: "PKR 7,200", priceNum: 7200, code: "HBL-BB-001", image: watchHublot, images: [watchHublot, watchHublot], description: "Bold skeleton dial with rubber strap. Chronograph movement with modern aesthetics. A statement piece for the bold.", category: "Sport" },
  { id: "3", name: "PRX Powermatic", brand: "Tissot", price: "PKR 6,800", priceNum: 6800, code: "TST-PRX-001", image: watchTissot, images: [watchTissot, watchTissot], description: "Silver sunray dial with integrated bracelet. Swiss precision at its finest. Versatile enough for any occasion.", category: "Classic" },
  { id: "4", name: "Tank Must", brand: "Cartier", price: "PKR 7,500", priceNum: 7500, code: "CTR-TNK-001", image: watchCartier, images: [watchCartier, watchCartier], description: "Iconic rectangular case with Roman numeral dial. Timeless elegance on leather. A piece of watchmaking history.", category: "Luxury" },
  { id: "5", name: "Classic Gold", brand: "Timas", price: "PKR 4,500", priceNum: 4500, code: "TMS-CLS-001", image: watchTimas, images: [watchTimas, watchTimas], description: "Minimalist gold case with black dial. Clean lines for everyday sophistication. Affordable luxury at its best.", category: "Classic" },
  { id: "6", name: "Rose Elegance", brand: "Aura", price: "PKR 5,200", priceNum: 5200, code: "AUR-RSE-001", image: watchAura, images: [watchAura, watchAura], description: "Rose gold case with blush dial. A statement of quiet luxury and grace. Perfect for special occasions.", category: "Luxury" },
  { id: "7", name: "Datejust Silver", brand: "Rolex", price: "PKR 9,000", priceNum: 9000, code: "RLX-DJ-002", image: watchRolex, images: [watchRolex, watchRolex], description: "The quintessential Rolex. Fluted bezel with Jubilee bracelet and date window. An icon of horology.", category: "Luxury" },
  { id: "8", name: "Classic Fusion", brand: "Hublot", price: "PKR 6,500", priceNum: 6500, code: "HBL-CF-002", image: watchHublot, images: [watchHublot, watchHublot], description: "Sleek titanium case with satin-finished dial. Bold yet refined. Perfect fusion of art and engineering.", category: "Sport" },
  { id: "9", name: "Gentleman", brand: "Tissot", price: "PKR 5,800", priceNum: 5800, code: "TST-GNT-002", image: watchTissot, images: [watchTissot, watchTissot], description: "Versatile dress watch with automatic movement. From boardroom to evening. Swiss reliability you can count on.", category: "Classic" },
  { id: "10", name: "Santos de Cartier", brand: "Cartier", price: "PKR 8,200", priceNum: 8200, code: "CTR-SNT-002", image: watchCartier, images: [watchCartier, watchCartier], description: "The watch that started it all. Square case with exposed screws. Aviation heritage meets luxury.", category: "Luxury" },
  { id: "11", name: "Sport Chrono", brand: "Timas", price: "PKR 4,800", priceNum: 4800, code: "TMS-SPT-002", image: watchTimas, images: [watchTimas, watchTimas], description: "Sporty chronograph with tachymeter bezel. Performance meets style. Built for the active lifestyle.", category: "Sport" },
  { id: "12", name: "Midnight Black", brand: "Aura", price: "PKR 5,500", priceNum: 5500, code: "AUR-MBK-002", image: watchAura, images: [watchAura, watchAura], description: "All-black design with rose gold accents. For the night owl in you. Understated elegance after dark.", category: "Classic" },
];
