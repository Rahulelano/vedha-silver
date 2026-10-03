import { useState, useEffect } from "react";

export function ProductsManager({ token }: { token: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newProd, setNewProd] = useState({
    name: "",
    slug: "",
    price: 0,
    compareAt: 0,
    productCode: "",
    badge: "",
    sizes: "",
    colors: "",
    description: "",
    category: "",
    image: "",
    images: [] as string[],
    stock: 10,
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products?t=" + Date.now(), { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data)) setProducts(data);
  };

  const fetchCats = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !newProd.category) {
          setNewProd(p => ({ ...p, category: data[0].slug }));
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCats();
  }, []);

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...newProd,
      sizes: typeof newProd.sizes === 'string' ? newProd.sizes.split(',').map(s => s.trim()).filter(Boolean) : newProd.sizes,
      colors: typeof newProd.colors === 'string' ? newProd.colors.split(',').map(c => c.trim()).filter(Boolean) : newProd.colors,
    };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setNewProd({ name: "", slug: "", price: 0, compareAt: 0, productCode: "", badge: "", sizes: "", colors: "", description: "", category: categories[0]?.slug || "", image: "", images: [], stock: 10 });
      setEditingId(null);
      fetchProducts();
    } else {
      const err = await res.json();
      alert(err.message || "Error saving product");
    }
  };

  const editProduct = (p: any) => {
    setEditingId(p._id);
    setNewProd({
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAt: p.compareAt || 0,
      productCode: p.productCode || "",
      badge: p.badge || "",
      sizes: p.sizes?.join(', ') || "",
      colors: p.colors?.join(', ') || "",
      description: p.description,
      category: p.category,
      image: p.image,
      images: p.images || [],
      stock: p.stock
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const url = await res.text();
        setNewProd({ ...newProd, image: url });
      } else {
        alert("Upload failed");
      }
    } catch {
      alert("Error uploading file");
    }
  };

  const uploadAdditionalImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const url = await res.text();
        setNewProd((p) => ({ ...p, images: [...(p.images || []), url] }));
      } else {
        alert("Upload failed");
      }
    } catch {
      alert("Error uploading file");
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border mt-4">
      <h2 className="text-xl font-bold mb-4">Manage Products ({products.length})</h2>
      
      <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-secondary/30 p-4 rounded-lg">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Name
          <input required value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="border p-2 rounded font-normal" placeholder="Meenakshi Temple Necklace" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Slug
          <input required value={newProd.slug} onChange={e => setNewProd({...newProd, slug: e.target.value})} className="border p-2 rounded font-normal" placeholder="meenakshi-temple-necklace" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Price (₹)
          <input required type="number" min="0" value={newProd.price} onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} className="border p-2 rounded font-normal" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Offer Price (₹) - Optional
          <input type="number" min="0" value={newProd.compareAt || ""} onChange={e => setNewProd({...newProd, compareAt: Number(e.target.value)})} className="border p-2 rounded font-normal" placeholder="e.g. 5000" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Product Code (SKU)
          <input value={newProd.productCode} onChange={e => setNewProd({...newProd, productCode: e.target.value})} className="border p-2 rounded font-normal" placeholder="VS-1234" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Badge
          <select value={newProd.badge} onChange={e => setNewProd({...newProd, badge: e.target.value})} className="border p-2 rounded font-normal bg-white">
            <option value="">None</option>
            <option value="New">New Arrival</option>
            <option value="Bestseller">Bestseller</option>
            <option value="Limited">Limited Edition</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Sizes (Comma separated)
          <input value={newProd.sizes} onChange={e => setNewProd({...newProd, sizes: e.target.value})} className="border p-2 rounded font-normal" placeholder="S, M, L, XL" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Colors (Comma separated)
          <input value={newProd.colors} onChange={e => setNewProd({...newProd, colors: e.target.value})} className="border p-2 rounded font-normal" placeholder="Silver, Gold, Rose Gold" />
        </label>
        
        <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-3">
          Description
          <textarea required value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} className="border p-2 rounded font-normal" placeholder="A Chettinad-inspired..." />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Category
          <select required value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})} className="border p-2 rounded font-normal bg-white">
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Main Image Upload
          <input type="file" onChange={uploadFileHandler} accept="image/*" className="border p-2 rounded font-normal" />
          {newProd.image && <img src={newProd.image} alt="preview" className="mt-1 h-12 w-12 object-cover rounded" />}
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-3">
          Additional Images
          <input type="file" onChange={uploadAdditionalImageHandler} accept="image/*" className="border p-2 rounded font-normal" />
          <div className="flex gap-2 mt-2 flex-wrap">
            {(newProd.images || []).map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img} alt="additional" className="h-16 w-16 object-cover rounded shadow-sm border" />
                <button type="button" onClick={() => setNewProd({...newProd, images: newProd.images.filter((_, i) => i !== idx)})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ))}
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Stock count
          <input required type="number" min="0" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: Number(e.target.value)})} className="border p-2 rounded font-normal" />
        </label>
        <div className="md:col-span-3 pt-2 flex gap-4">
          <button type="submit" className="bg-charcoal text-white py-2 px-6 rounded font-semibold">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setNewProd({ name: "", slug: "", price: 0, compareAt: 0, productCode: "", badge: "", sizes: "", colors: "", description: "", category: categories[0]?.slug || "", image: "", images: [], stock: 10 }); }} className="bg-gray-300 text-charcoal py-2 px-6 rounded font-semibold">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border p-4 rounded-lg flex flex-col gap-2 bg-white relative">
            <img src={p.image} alt={p.name} className="h-40 w-full object-cover rounded" />
            <div className="absolute top-6 right-6 flex gap-1 items-center">
              {p.images && p.images.length > 0 && <span className="text-xs bg-black/60 text-white px-2 py-1 rounded shadow">+{p.images.length}</span>}
              {p.badge && <span className="text-xs bg-accent text-white px-2 py-1 rounded shadow ml-1">{p.badge}</span>}
            </div>
            <h3 className="font-bold truncate" title={p.name}>{p.name} {p.productCode ? `(${p.productCode})` : ""}</h3>
            <p className="text-sm line-clamp-2 text-muted-foreground">{p.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold text-charcoal">₹{p.price}</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded">Stock: {p.stock}</span>
            </div>
            <div className="flex gap-4 mt-2">
              <button onClick={() => editProduct(p)} className="text-blue-500 font-semibold self-start">Edit</button>
              <button onClick={() => deleteProduct(p._id)} className="text-red-500 font-semibold self-start">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
