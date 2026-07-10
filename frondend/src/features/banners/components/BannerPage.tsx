import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Loader2, Trash2 } from "lucide-react";
import type { Banner } from "../types";
import PageHeader from "@shared/components/PageHeader";
import DeleteModal from "@shared/components/DeleteModal";
import { Button } from "@shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { getBanners, deleteBannerApi } from "../api/bannersApi";

const BannerPage = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setBanners(await getBanners());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = filter === "all" ? banners : banners.filter((b) => b.active === (filter === "active"));

  const handleDelete = async () => {
    if (!deleteId) return;
    setBanners((prev) => prev.filter((b) => b.id !== deleteId));
    setDeleteId(null);
    try {
      await deleteBannerApi(deleteId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        description={loading ? "Loading…" : `${filtered.length} banners`}
        action={
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Filter" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => navigate("/banners/new")}>
              <Plus className="mr-1 h-4 w-4" />
              Add Banner
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading banners…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-white/50">No banners found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((banner) => (
            <div key={banner.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="aspect-[16/7] w-full overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-white">{banner.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${banner.active ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                    {banner.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {banner.subtitle && <p className="text-sm text-white/60">{banner.subtitle}</p>}
                <div className="mt-3 flex justify-end gap-1">
                  <button type="button" onClick={() => navigate(`/banners/${banner.id}`)} className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:bg-white/10"><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setDeleteId(banner.id)} className="rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-white/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default BannerPage;
