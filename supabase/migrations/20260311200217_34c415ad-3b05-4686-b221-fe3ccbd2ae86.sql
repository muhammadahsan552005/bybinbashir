
-- Create app_role enum
create type public.app_role as enum ('admin', 'customer');

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  address text,
  city text,
  created_at timestamptz default now()
);

-- User roles table (separate for security)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'customer',
  unique (user_id, role)
);

-- Security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

-- Collections
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  collection_name text not null,
  slug text unique not null,
  description text,
  hero_color text default 'from-slate-950/40',
  image_url text,
  created_at timestamptz default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  product_code text unique not null,
  description text,
  price numeric not null default 0,
  collection_id uuid references public.collections(id) on delete set null,
  stock_quantity integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product images
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone_number text not null,
  address text not null,
  city text not null,
  notes text,
  total_price numeric not null default 0,
  order_status text not null default 'pending',
  created_at timestamptz default now()
);

-- Order items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_code text not null,
  quantity integer not null default 1,
  price numeric not null default 0,
  created_at timestamptz default now()
);

-- Trigger to auto-create profile and assign customer role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  
  insert into public.user_roles (user_id, role)
  values (new.id, 'customer');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (public.has_role(auth.uid(), 'admin'));

-- User roles policies
create policy "Users can view own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "Admins can manage roles" on public.user_roles for all using (public.has_role(auth.uid(), 'admin'));

-- Collections policies (public read, admin write)
create policy "Anyone can view collections" on public.collections for select to anon, authenticated using (true);
create policy "Admins can insert collections" on public.collections for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update collections" on public.collections for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete collections" on public.collections for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Products policies (public read, admin write)
create policy "Anyone can view products" on public.products for select to anon, authenticated using (true);
create policy "Admins can insert products" on public.products for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update products" on public.products for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete products" on public.products for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Product images policies
create policy "Anyone can view product images" on public.product_images for select to anon, authenticated using (true);
create policy "Admins can insert product images" on public.product_images for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete product images" on public.product_images for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Orders policies
create policy "Users can view own orders" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert to authenticated with check (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update orders" on public.orders for update to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Order items policies
create policy "Users can view own order items" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can create order items" on public.order_items for insert to authenticated with check (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Admins can view all order items" on public.order_items for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Storage policies for product-images bucket
create policy "Anyone can view product images storage" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins can upload product images storage" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins can update product images storage" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete product images storage" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- Seed collections with existing brand data
insert into public.collections (collection_name, slug, description, hero_color) values
  ('Rolex', 'rolex', 'The crown jewel of watchmaking. Rolex represents the pinnacle of precision engineering and timeless design, a symbol of achievement recognized across the globe.', 'from-emerald-950/40'),
  ('Hublot', 'hublot', 'The art of fusion. Hublot pushes boundaries with bold, avant-garde designs that merge traditional Swiss craftsmanship with cutting-edge materials and innovation.', 'from-slate-950/40'),
  ('Tissot', 'tissot', 'Swiss excellence since 1853. Tissot combines tradition and innovation, delivering refined timepieces that embody accessible luxury and exceptional quality.', 'from-blue-950/40'),
  ('Cartier', 'cartier', 'The jeweller of kings, the king of jewellers. Cartier''s watchmaking legacy is defined by elegant forms and architectural precision that transcend time.', 'from-red-950/40'),
  ('Timas', 'timas', 'Contemporary sophistication meets accessible elegance. Timas delivers modern timepieces with clean lines and refined details for the discerning individual.', 'from-amber-950/40'),
  ('Aura', 'aura', 'Radiance redefined. Aura watches capture light and attention with rose gold warmth and minimalist design, perfect for those who appreciate understated beauty.', 'from-rose-950/40');

-- Seed products
insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Submariner Gold', 'RLX-SUB-001', 'Classic gold Submariner with black dial. Water-resistant design with luminous markers. Premium build quality with automatic movement.', 8500, c.id, 10
from public.collections c where c.slug = 'rolex';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Big Bang Black', 'HBL-BB-001', 'Bold skeleton dial with rubber strap. Chronograph movement with modern aesthetics. A statement piece for the bold.', 7200, c.id, 10
from public.collections c where c.slug = 'hublot';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'PRX Powermatic', 'TST-PRX-001', 'Silver sunray dial with integrated bracelet. Swiss precision at its finest. Versatile enough for any occasion.', 6800, c.id, 10
from public.collections c where c.slug = 'tissot';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Tank Must', 'CTR-TNK-001', 'Iconic rectangular case with Roman numeral dial. Timeless elegance on leather. A piece of watchmaking history.', 7500, c.id, 10
from public.collections c where c.slug = 'cartier';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Classic Gold', 'TMS-CLS-001', 'Minimalist gold case with black dial. Clean lines for everyday sophistication. Affordable luxury at its best.', 4500, c.id, 10
from public.collections c where c.slug = 'timas';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Rose Elegance', 'AUR-RSE-001', 'Rose gold case with blush dial. A statement of quiet luxury and grace. Perfect for special occasions.', 5200, c.id, 10
from public.collections c where c.slug = 'aura';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Datejust Silver', 'RLX-DJ-002', 'The quintessential Rolex. Fluted bezel with Jubilee bracelet and date window. An icon of horology.', 9000, c.id, 10
from public.collections c where c.slug = 'rolex';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Classic Fusion', 'HBL-CF-002', 'Sleek titanium case with satin-finished dial. Bold yet refined. Perfect fusion of art and engineering.', 6500, c.id, 10
from public.collections c where c.slug = 'hublot';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Gentleman', 'TST-GNT-002', 'Versatile dress watch with automatic movement. From boardroom to evening. Swiss reliability you can count on.', 5800, c.id, 10
from public.collections c where c.slug = 'tissot';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Santos de Cartier', 'CTR-SNT-002', 'The watch that started it all. Square case with exposed screws. Aviation heritage meets luxury.', 8200, c.id, 10
from public.collections c where c.slug = 'cartier';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Sport Chrono', 'TMS-SPT-002', 'Sporty chronograph with tachymeter bezel. Performance meets style. Built for the active lifestyle.', 4800, c.id, 10
from public.collections c where c.slug = 'timas';

insert into public.products (product_name, product_code, description, price, collection_id, stock_quantity)
select 'Midnight Black', 'AUR-MBK-002', 'All-black design with rose gold accents. For the night owl in you. Understated elegance after dark.', 5500, c.id, 10
from public.collections c where c.slug = 'aura';
