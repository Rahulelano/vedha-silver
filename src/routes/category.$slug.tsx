import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    try {
      const catRes = await fetch("/api/categories");
      const cats = await catRes.json();
      const category = cats.find((c: any) => c.slug === params.slug);
      
      const prodRes = await fetch("/api/products");
      const prods = await prodRes.json();
      const products = prods.filter((p: any) => p.category === params.slug);

      if (!category) throw notFound();
      return { category, categories: cats, products };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Category unavailable | Vedhav Silvers" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `Silver ${loaderData.category.name} | Vedhav Silvers Chennai`;
    const description = `Shop hallmarked 925 sterling silver ${loaderData.category.name.toLowerCase()} — ${loaderData.category.blurb?.toLowerCase()} — hand-finished in Mylapore, Chennai.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, categories, products } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHeader
        eyebrow={category.blurb || category.name}
        title={category.name}
        subtitle={`${products.length} hand-finished pieces in hallmarked 925 sterling silver.`}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="px-2">/</span>
          <Link to="/shop" className="hover:underline">Shop</Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((p: any, i: number) => (
            <Reveal key={p._id || p.id} delay={(i % 4) * 70}>
              <ProductCard product={{...p, id: p._id || p.id, gallery: []}} />
            </Reveal>
          ))}
          {products.length === 0 && <p className="text-muted-foreground py-10 col-span-4 text-center">No products found in this category.</p>}
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-2">
          {categories.filter((c: any) => c.slug !== category.slug).map((c: any) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="rounded-full border border-border px-4 py-2 text-xs tracking-[0.14em] uppercase hover:bg-secondary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
