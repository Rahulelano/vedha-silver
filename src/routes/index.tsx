import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Gem, Instagram, Quote, RefreshCcw, Truck } from "lucide-react";
import { PageShell } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { Carousel } from "@/components/site/Carousel";
import { Reveal } from "@/components/site/Reveal";
import { BRAND, COLLECTION_IMAGE, GALLERY_IMAGES } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vedhav Silvers | Fine Silver Jewellery for Women & Kids, Chennai" },
      {
        name: "description",
        content:
          "Hallmarked 925 sterling silver necklaces, jhumkas, bangles, rings and kids jewellery — hand-finished in Mylapore, Chennai. Free shipping above ₹4,999.",
      },
      {
        property: "og:title",
        content: "Vedhav Silvers | Fine Silver Jewellery for Women & Kids",
      },
      {
        property: "og:description",
        content: "Hallmarked 925 sterling silver, hand-finished in Mylapore, Chennai.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [heroSetting, setHeroSetting] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBestsellers(data.filter((d) => d.tags?.includes("bestseller") || d.isFeatured));
          setArrivals(data.filter((d) => d.tags?.includes("new")));
        }
      })
      .catch(() => {});

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});

    fetch("/api/settings/hero")
      .then((r) => r.json())
      .then((data) => {
        if (data) setHeroSetting(data);
      })
      .catch(() => {});

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-charcoal-foreground">
        {heroSetting?.images?.length > 0 ? (
          heroSetting.images.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`Hero slider image ${idx + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                idx === currentSlide % heroSetting.images.length ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        ) : heroSetting?.image ? (
          <img
            src={heroSetting.image}
            alt="Hero Background"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 opacity-100"
          />
        ) : (
          GALLERY_IMAGES.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Product slider image ${idx + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                idx === currentSlide % GALLERY_IMAGES.length ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        )}

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
        <div className="relative z-20 mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-20 sm:px-6">
          <div className="max-w-xl">
            <p className="eyebrow text-charcoal-foreground/70">Mylapore · Chennai · Since 1994</p>
            <h1 className="mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              {heroSetting?.title || (
                <>
                  Silver that carries <span className="italic text-silver-sheen">her story</span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-charcoal-foreground/75 sm:text-base">
              {heroSetting?.subtitle ||
                "Hallmarked 925 sterling silver for women and little ones — temple heirlooms, everyday minimals and first kolusus, hand-finished by our artisans."}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-md bg-charcoal-foreground px-8 py-4 text-xs tracking-[0.2em] uppercase text-charcoal transition-transform hover:-translate-y-0.5"
              >
                Shop the collection
              </Link>
              <Link
                to="/category/$slug"
                params={{ slug: "kids" }}
                className="glass-dark rounded-md px-8 py-4 text-xs tracking-[0.2em] uppercase text-charcoal-foreground"
              >
                For kids
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee benefits */}
      <div className="border-b border-border bg-secondary/50">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 px-4 py-6 text-xs sm:px-6 lg:grid-cols-4">
          {[
            { Icon: BadgeCheck, t: "BIS Hallmarked 925" },
            { Icon: Truck, t: "Free shipping above ₹4,999" },
            { Icon: RefreshCcw, t: "15-day easy exchange" },
            { Icon: Gem, t: "Lifetime re-polish" },
          ].map(({ Icon, t }) => (
            <li key={t} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4 shrink-0" /> {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow text-muted-foreground">Explore</p>
          <h2 className="mt-4 text-3xl lg:text-4xl">Shop by category</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative block overflow-hidden rounded-lg"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="text-lg text-charcoal-foreground">{c.name}</h3>
                  <p className="text-xs text-charcoal-foreground/70">{c.blurb}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bestsellers carousel */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-muted-foreground">Loved most</p>
              <h2 className="mt-4 text-3xl lg:text-4xl">Best sellers</h2>
            </div>
            <Link
              to="/shop"
              className="hidden text-xs uppercase tracking-[0.2em] underline underline-offset-4 sm:block"
            >
              View all
            </Link>
          </Reveal>
          <div className="mt-10">
            {bestsellers.length > 0 && (
              <Carousel label="Best sellers">
                {bestsellers.map((p) => (
                  <ProductCard key={p._id || p.id} product={{ ...p, id: p._id || p.id, gallery: [] }} />
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Collection banner */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-xl bg-charcoal">
          <img
            src={COLLECTION_IMAGE}
            alt="Silver bridal jewellery set on charcoal velvet"
            loading="lazy"
            width={1200}
            height={900}
            className="h-full w-full object-cover opacity-80 lg:absolute lg:inset-0"
          />
          <div className="relative p-8 text-charcoal-foreground sm:p-14 lg:max-w-lg lg:py-24">
            <div className="glass-dark rounded-lg p-8">
              <p className="eyebrow text-charcoal-foreground/70">Limited atelier release</p>
              <h2 className="mt-4 text-3xl lg:text-4xl">The Vaanam Bridal Edit</h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-foreground/75">
                Floral filigree necklaces, jhumkas and bangle pairs — a complete muhurtham set in
                hallmarked silver, presented in a lacquered keepsake box.
              </p>
              <Link
                to="/product/$slug"
                params={{ slug: "vaanam-bridal-set" }}
                className="mt-7 inline-block rounded-md bg-charcoal-foreground px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-charcoal"
              >
                Discover the set
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow text-muted-foreground">Just landed</p>
          <h2 className="mt-4 text-3xl lg:text-4xl">New arrivals</h2>
        </Reveal>
        <div className="mt-10">
          {arrivals.length > 0 && (
            <Carousel label="New arrivals">
              {arrivals.map((p) => (
                <ProductCard key={p._id || p.id} product={{ ...p, id: p._id || p.id, gallery: [] }} />
              ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-charcoal py-20 text-charcoal-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="text-center">
            <p className="eyebrow text-charcoal-foreground/60">Kind words</p>
            <h2 className="mt-4 text-3xl lg:text-4xl">From our clients</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                q: "The temple necklace was even finer in person. My mother wore it for my sister's muhurtham and everyone asked where it was from.",
                n: "Divya R.",
                c: "Adyar, Chennai",
              },
              {
                q: "Bought the baby anklets for my daughter's first birthday. Beautifully rounded edges and the bells are so soft.",
                n: "Anitha S.",
                c: "Coimbatore",
              },
              {
                q: "I wear the Mira studs every single day — shower, gym, everything. Still bright after a year.",
                n: "Keerthana M.",
                c: "Bengaluru",
              },
            ].map((t, i) => (
              <Reveal key={t.n} delay={i * 90}>
                <figure className="glass-dark h-full rounded-lg p-8">
                  <Quote className="size-6 text-charcoal-foreground/40" />
                  <blockquote className="mt-5 text-sm leading-relaxed text-charcoal-foreground/85">
                    {t.q}
                  </blockquote>
                  <figcaption className="mt-6 text-xs text-charcoal-foreground/60">
                    {t.n} · {t.c}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram gallery */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow text-muted-foreground">@vedhavsilvers</p>
          <h2 className="mt-4 text-3xl lg:text-4xl">Styled by you</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GALLERY_IMAGES.map((img, i) => (
            <a
              key={i}
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative overflow-hidden rounded-md"
            >
              <img
                src={img}
                alt="Vedhav Silvers jewellery on Instagram"
                loading="lazy"
                width={900}
                height={1100}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 grid place-items-center bg-charcoal/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="size-5 text-charcoal-foreground" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-4 pb-8 text-center sm:px-6">
        <Reveal className="glass rounded-xl p-10">
          <h2 className="text-3xl">Join the silver circle</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Early access to atelier releases, care tips and ₹500 off your first order.
          </p>
          {subscribed ? (
            <p className="mt-8 text-sm">Welcome to the circle — check your inbox.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="h-12 rounded-md bg-charcoal px-8 text-xs uppercase tracking-[0.2em] text-charcoal-foreground"
              >
                Subscribe
              </button>
            </form>
          )}
        </Reveal>
      </section>
    </PageShell>
  );
}
