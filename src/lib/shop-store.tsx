import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./products";

export type CartLine = {
  key: string;
  id: string;
  variant: string;
  qty: number;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  quickView: Product | null;
  orders: { id: string; total: number; date: string; items: number }[];
  setCartOpen: (v: boolean) => void;
  setQuickView: (p: Product | null) => void;
  addToCart: (id: string, variant: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  placeOrder: () => string;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  lines: (CartLine & { product: Product })[];
};

const ShopCtx = createContext<ShopState | null>(null);

const read = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<ShopState["orders"]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    setCart(read<CartLine[]>("vs_cart", []));
    setWishlist(read<string[]>("vs_wishlist", []));
    setOrders(read<ShopState["orders"]>("vs_orders", []));
    setHydrated(true);

    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDbProducts(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("vs_cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("vs_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("vs_orders", JSON.stringify(orders));
  }, [orders, hydrated]);

  const addToCart = useCallback((id: string, variant: string, qty = 1) => {
    const key = `${id}__${variant}`;
    setCart((c) => {
      const found = c.find((l) => l.key === key);
      if (found) return c.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...c, { key, id, variant, qty }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((c) =>
      qty <= 0 ? c.filter((l) => l.key !== key) : c.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setCart((c) => c.filter((l) => l.key !== key));
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);

  const lines = useMemo(
    () =>
      cart.flatMap((l) => {
        const product = dbProducts.find((p) => p._id === l.id || p.id === l.id);
        return product ? [{ ...l, product }] : [];
      }),
    [cart, dbProducts],
  );

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 4999 ? 0 : 149;
  const count = cart.reduce((s, l) => s + l.qty, 0);

  const placeOrder = useCallback(() => {
    const id = "VS" + Math.floor(100000 + Math.random() * 899999);
    setOrders((o) => [
      {
        id,
        total: subtotal + (subtotal >= 4999 ? 0 : 149),
        date: new Date().toISOString(),
        items: count,
      },
      ...o,
    ]);
    setCart([]);
    return id;
  }, [subtotal, count]);

  const value: ShopState = {
    cart,
    wishlist,
    cartOpen,
    quickView,
    orders,
    setCartOpen,
    setQuickView,
    addToCart,
    setQty,
    removeLine,
    clearCart: () => setCart([]),
    toggleWishlist,
    inWishlist: (id) => wishlist.includes(id),
    placeOrder,
    count,
    subtotal,
    shipping,
    total: subtotal + shipping,
    lines,
  };

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
