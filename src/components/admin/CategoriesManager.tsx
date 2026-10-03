import { useState, useEffect } from "react";

export function CategoriesManager({ token }: { token: string }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState({ name: "", slug: "", blurb: "", image: "" });

  const fetchCats = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const saveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newCat),
    });
    if (res.ok) {
      setNewCat({ name: "", slug: "", blurb: "", image: "" });
      setEditingId(null);
      fetchCats();
    } else {
      const err = await res.json();
      alert(err.message || "Error saving category");
    }
  };

  const editCat = (c: any) => {
    setEditingId(c._id);
    setNewCat({ name: c.name, slug: c.slug, blurb: c.blurb, image: c.image });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteCat = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCats();
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
        setNewCat({ ...newCat, image: url });
      } else {
        alert("Upload failed");
      }
    } catch {
      alert("Error uploading file");
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border mt-4">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
      
      <form onSubmit={saveCat} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-secondary/30 p-4 rounded-lg">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Name</label>
          <input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} required className="border p-2 rounded" placeholder="e.g. Necklaces" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Slug</label>
          <input value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} required className="border p-2 rounded" placeholder="e.g. necklaces" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Blurb / Subtitle</label>
          <input value={newCat.blurb} onChange={(e) => setNewCat({ ...newCat, blurb: e.target.value })} required className="border p-2 rounded" placeholder="Temple & contemporary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Image Upload</label>
          <input type="file" onChange={uploadFileHandler} accept="image/*" className="border p-2 rounded" />
          {newCat.image && <img src={newCat.image} alt="preview" className="mt-2 h-10 w-10 object-cover rounded" />}
        </div>
        <div className="md:col-span-2 pt-2 flex gap-4">
          <button type="submit" className="bg-charcoal text-white px-6 py-2 rounded font-semibold w-full md:w-auto">
            {editingId ? "Update Category" : "Add Category"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setNewCat({ name: "", slug: "", blurb: "", image: "" }); }} className="bg-gray-300 text-charcoal px-6 py-2 rounded font-semibold w-full md:w-auto">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div key={c._id} className="border p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white gap-4">
            <div className="flex gap-4 items-center">
              <img src={c.image} alt={c.name} className="w-12 h-12 rounded object-cover shrink-0" />
              <div>
                <p className="font-bold">{c.name} <span className="text-xs font-normal text-muted-foreground ml-2">/{c.slug}</span></p>
                <p className="text-sm text-muted-foreground line-clamp-1 break-all">{c.blurb}</p>
              </div>
            </div>
            <div className="flex gap-2 sm:shrink-0">
              <button onClick={() => editCat(c)} className="text-blue-500 hover:text-blue-700 font-semibold px-2">Edit</button>
              <button onClick={() => deleteCat(c._id)} className="text-red-500 hover:text-red-700 font-semibold px-2">Delete</button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-muted-foreground">No categories found. Add one above.</p>}
      </div>
    </div>
  );
}
