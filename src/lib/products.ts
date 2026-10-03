import necklace from "@/assets/p-necklace.jpg";
import earrings from "@/assets/p-earrings.jpg";
import bangles from "@/assets/p-bangles.jpg";
import ring from "@/assets/p-ring.jpg";
import anklet from "@/assets/p-anklet.jpg";
import kids from "@/assets/p-kids.jpg";
import pendant from "@/assets/p-pendant.jpg";
import studs from "@/assets/p-studs.jpg";
import bridal from "@/assets/collection-bridal.jpg";

export type CategorySlug = string;

export type Product = {
  id?: string;
  _id?: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  image: string;
  images?: string[];
  gallery?: string[];
  purity?: string;
  weight?: string;
  sizes?: string[];
  colors?: string[];
  productCode?: string;
  stock: number;
  description: string;
  variants?: { label: string; options: string[] };
  rating: number;
  reviews: number;
  badge?: "New" | "Bestseller" | "Limited";
  tags: string[];
};

export const COLLECTION_IMAGE = bridal;
export const GALLERY_IMAGES = [necklace, earrings, bangles, ring, anklet, pendant, studs, kids];

export const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const BRAND = {
  name: "Vedhav Silvers",
  tagline: "Chennai's house of fine silver",
  phone: "+91 98400 12345",
  phoneHref: "tel:+919840012345",
  email: "vedhavsilvers@gmail.com",
  address: "No. 42, North Mada Street, Mylapore, Chennai 600004, Tamil Nadu",
  hours: "Mon – Sat · 10:00 AM – 8:30 PM",
  instagram: "https://instagram.com/vedhavsilvers",
  facebook: "https://facebook.com/vedhavsilvers",
  pinterest: "https://pinterest.com/vedhavsilvers",
  youtube: "https://youtube.com/@vedhavsilvers",
  whatsapp: "https://wa.me/919840012345",
};
