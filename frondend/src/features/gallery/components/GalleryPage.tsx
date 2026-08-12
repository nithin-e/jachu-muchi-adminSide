import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Loader2, Trash2 } from "lucide-react";
import type { GalleryItem, GalleryCategory } from "../types";
import PageHeader from "@shared/components/PageHeader";
import DeleteModal from "@shared/components/DeleteModal";
import { Button } from "@shared/components/ui/button";
import { ResponsiveTable } from "@shared/components/ui/ResponsiveTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { getGalleryItems, deleteGalleryItemApi } from "../api/galleryApi";
import { getImageUrl } from "@lib/imageUrl";

const GalleryPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  useEffect(() => {
    void load();
  }, []);

  const filtered = filter === "all" ? items : items.filter((item) => item.category === filter);
  const categories: GalleryCategory[] = [...new Set(items.map((i) => i.category))];

  const handleDelete = async () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteId));
    setDeleteId(null);
    try {
      await deleteGalleryItemApi(deleteId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description={loading ? "Loading…" : `${filtered.length} images`}
        action={
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as GalleryCategory | "all")}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => navigate("/gallery/new")}>
              <Plus className="mr-1 h-4 w-4" />
              Add Image
            </Button>
          </div>
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
                src={getImageUrl(item.url ?? item.image, "gallery")}
                alt={item.title}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => navigate(`/gallery/edit/${item.id}`)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:bg-blue-500"
                  aria-label={`Edit ${item.title}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:bg-red-500"
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-white/60">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default GalleryPage;
