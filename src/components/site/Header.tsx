import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BRAND } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import logoUrl from "@/assets/1000278769-removebg-preview.png";

export function Header() {
  const { count, wishlist, setCartOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <div className="bg-blue-950 px-4 py-2 text-center text-[0.7rem] tracking-[0.18em] text-white uppercase">
        Complimentary shipping across India on orders above ₹4,999
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 bg-blue-950 text-white",
          scrolled ? "shadow-soft" : "",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-20">
          <button
            type="button"
            className="lg:hidden rounded-md p-1 hover:bg-white/10 transition-colors"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <Menu className="size-5" />
          </button>

          <Link to="/" className="mr-auto flex items-center lg:mr-8">
            <img
              src={logoUrl}
              alt="Vedhav Silvers"
              className="h-12 lg:h-16 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <nav className="mx-auto hidden items-center gap-7 text-sm lg:flex">
            <Link to="/shop" className="text-white/90 transition-colors hover:text-white">
              Shop All
            </Link>
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="text-white/90 transition-colors hover:text-white"
              >
                {c.name}
              </Link>
            ))}
            <Link
              to="/category/$slug"
              params={{ slug: "kids" }}
              className="text-white/90 transition-colors hover:text-white"
            >
              Kids
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div className="relative flex items-center">
              {searchOpen ? (
                <form action="/shop" method="get" className="absolute right-0 flex items-center bg-white/10 rounded-full pl-3 pr-1 py-1 w-48 sm:w-64 transition-all">
                  <input
                    name="q"
                    type="text"
                    autoFocus
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/60 w-full"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full">
                    <X className="size-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search the store"
                  className="grid size-9 place-items-center rounded-full transition-colors hover:bg-white/10"
                >
                  <Search className="size-[1.05rem]" />
                </button>
              )}
            </div>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid size-9 place-items-center rounded-full transition-colors hover:bg-white/10"
            >
              <Heart className="size-[1.05rem]" />
              {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
            </Link>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden size-9 place-items-center rounded-full transition-colors hover:bg-white/10 sm:grid"
            >
              <User className="size-[1.05rem]" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping bag, ${count} items`}
              className="relative grid size-9 place-items-center rounded-full transition-colors hover:bg-white/10"
            >
              <ShoppingBag className="size-[1.05rem]" />
              {count > 0 && <Badge>{count}</Badge>}
            </button>
          </div>
        </div>
        <div className="border-b border-white/10" />
      </header>

      {menu && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-blue-950/50"
            onClick={() => setMenu(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-blue-950 text-white p-6 shadow-luxe">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-display)] text-xl">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenu(false)}
                className="rounded-md p-1 hover:bg-white/10 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1 text-lg">
              <Link
                to="/shop"
                onClick={() => setMenu(false)}
                className="border-b border-white/10 py-3"
              >
                Shop All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setMenu(false)}
                  className="border-b border-white/10 py-3"
                >
                  {c.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={() => setMenu(false)}
                className="border-b border-white/10 py-3"
              >
                Wishlist
              </Link>
              <Link
                to="/account"
                onClick={() => setMenu(false)}
                className="border-b border-white/10 py-3"
              >
                Account
              </Link>
            </nav>
            <a href={BRAND.phoneHref} className="mt-auto text-sm text-white/80 hover:text-white">
              {BRAND.phone}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-price absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-white px-1 text-[0.6rem] leading-4 text-blue-950 shadow-sm">
      {children}
    </span>
  );
}
