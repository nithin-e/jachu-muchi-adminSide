import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { GalleryItem, GalleryCategory } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { ResponsiveTable } from "@shared/components/ui/ResponsiveTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { getGalleryItems } from "../api/galleryApi";

const GalleryPage = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setItems(await getGalleryItems());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = filter === "all" ? items : items.filter((item) => item.category === filter);
  const categories: GalleryCategory[] = [...new Set(items.map((i) => i.category))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description={loading ? "Loading…" : `${filtered.length} images`}
        action={
          <Select value={filter} onValueChange={(v) => setFilter(v as GalleryCategory | "all")}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading gallery…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-white/50">No images found.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-white/10 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <img
                src={item.url}
                alt={item.title}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-white/60">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
