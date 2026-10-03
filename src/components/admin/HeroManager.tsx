import { useState, useEffect } from "react";

export function HeroManager({ token }: { token: string }) {
  const [heroSetting, setHeroSetting] = useState<{title: string, subtitle: string, image?: string, images?: string[]}>({ title: "", subtitle: "", images: [] });

  useEffect(() => {
    fetch("/api/settings/hero")
      .then((r) => {
        if (r.ok) return r.json();
        return null;
      })
      .then((data) => {
        if (data) setHeroSetting(data);
      })
      .catch(() => {});
  }, []);

  const saveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/settings/hero", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value: heroSetting }),
    });
    if (res.ok) {
      alert("Hero section updated successfully!");
    } else {
      alert("Failed to update Hero section");
    }
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
        const newImages = [...(heroSetting.images || []), url];
        if (heroSetting.image && !heroSetting.images?.length) {
            newImages.unshift(heroSetting.image);
        }
        setHeroSetting({ ...heroSetting, images: newImages });
      } else {
        alert("Upload failed");
      }
    } catch {
      alert("Error uploading file");
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border mt-4">
      <h2 className="text-xl font-bold mb-4">Manage Hero Section</h2>
      <form onSubmit={saveHero} className="flex flex-col gap-4 max-w-2xl">
        <label className="text-sm font-semibold">Title</label>
        <input
          value={heroSetting.title}
          onChange={(e) => setHeroSetting({ ...heroSetting, title: e.target.value })}
          placeholder="Silver that carries her story"
          className="border border-border p-2 rounded"
        />
        <label className="text-sm font-semibold">Subtitle / Description</label>
        <textarea
          value={heroSetting.subtitle}
          onChange={(e) => setHeroSetting({ ...heroSetting, subtitle: e.target.value })}
          placeholder="Hallmarked 925 sterling silver..."
          className="border border-border p-2 rounded h-24"
        />
        <label className="text-sm font-semibold">Hero Slider Images</label>
        <div className="flex flex-col gap-2">
          {(!heroSetting.images || heroSetting.images.length === 0) && heroSetting.image && (
            <div className="flex items-center gap-4 border p-2 rounded">
              <img src={heroSetting.image} alt="Hero" className="w-16 h-16 object-cover rounded" />
              <button type="button" className="text-red-500 text-sm" onClick={() => setHeroSetting({...heroSetting, image: ""})}>Remove</button>
            </div>
          )}
          {heroSetting.images?.map((url, i) => (
            <div key={i} className="flex items-center gap-4 border p-2 rounded">
              <img src={url} alt={`Slide ${i}`} className="w-16 h-16 object-cover rounded" />
              <button 
                type="button" 
                className="text-red-500 text-sm" 
                onClick={() => setHeroSetting({
                  ...heroSetting, 
                  images: heroSetting.images!.filter((_, index) => index !== i)
                })}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-4 items-center mt-2">
            <input
              type="file"
              onChange={uploadFileHandler}
              accept="image/*"
              className="border border-border p-2 rounded flex-1"
            />
          </div>
        </div>
        <button type="submit" className="bg-charcoal text-charcoal-foreground font-semibold py-2 rounded px-6 self-start mt-4">
          Save Hero Settings
        </button>
      </form>
    </div>
  );
}
