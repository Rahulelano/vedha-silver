import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { BRAND } from "@/lib/products";
import logoUrl from "@/assets/1000278769-removebg-preview.png";

export function Footer() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="mt-24 bg-blue-950 text-white border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div>
          <Link to="/" className="inline-block">
            <img
              src={logoUrl}
              alt="Vedhav Silvers"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {BRAND.tagline}. Hallmarked 925 sterling silver for women and children, hand-finished in
            Mylapore since 1994.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: BRAND.instagram, Icon: Instagram, label: "Instagram" },
              { href: BRAND.facebook, Icon: Facebook, label: "Facebook" },
              { href: BRAND.youtube, Icon: Youtube, label: "YouTube" },
              { href: BRAND.pinterest, Icon: Mail, label: "Pinterest" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Shop">
          <h3 className="eyebrow text-white/60">Shop</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/shop" className="text-white/80 hover:text-white">
                All Jewellery
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="text-white/80 hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account and help">
          <h3 className="eyebrow text-white/60">Client Care</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/account" className="text-white/80 hover:text-white">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="text-white/80 hover:text-white">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-white/80 hover:text-white">
                Shopping Bag
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="text-white/80 hover:text-white">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/care" className="text-white/80 hover:text-white">
                Silver Care Guide
              </Link>
            </li>
            <li>
              <Link to="/hallmark" className="text-white/80 hover:text-white">
                Hallmark & Authenticity
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-white/80 hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-white/80 hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </nav>

        <address className="not-italic">
          <h3 className="eyebrow text-white/60">Visit the Atelier</h3>
          <ul className="mt-5 space-y-4 text-sm text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{BRAND.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a href={BRAND.phoneHref} className="hover:text-white">
                {BRAND.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-white">
                {BRAND.email}
              </a>
            </li>
            <li className="text-white/60">{BRAND.hours}</li>
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Vedhav Silvers. All rights reserved.</p>
          <p>BIS Hallmarked 925 Silver · Prices inclusive of GST · Demo storefront</p>
        </div>
      </div>
    </footer>
  );
}
