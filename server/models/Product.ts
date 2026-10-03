import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    compareAt: { type: Number },
    productCode: { type: String },
    badge: { type: String, default: "" },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
