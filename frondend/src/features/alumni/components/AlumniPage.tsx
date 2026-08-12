import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Loader2, Trash2 } from "lucide-react";
import type { Alumni } from "../types";
import PageHeader from "@shared/components/PageHeader";
import DeleteModal from "@shared/components/DeleteModal";
import { Button } from "@shared/components/ui/button";
import { getAlumniList, deleteAlumniApi } from "../api/alumniApi";
import { getImageUrl } from "@lib/imageUrl";

const AlumniPage = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setAlumni(await getAlumniList());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setAlumni((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
    try {
      await deleteAlumniApi(deleteId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni"
        description={loading ? "Loading…" : `${alumni.length} alumni`}
        action={
          <Button size="sm" onClick={() => navigate("/alumni/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Add Alumni
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading alumni…</span>
        </div>
      ) : alumni.length === 0 ? (
        <div className="p-8 text-center text-sm text-white/50">No alumni found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {alumni.map((a) => (
            <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {a.image && (
                    <img src={getImageUrl(a.image, "alumni")} alt={a.name} className="h-12 w-12 rounded-full object-cover" />
                  )}
                  <div>
                    <h3 className="font-medium text-white">{a.name}</h3>
                    {a.role && <p className="text-xs text-white/50">{a.role}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => navigate(`/alumni/${a.id}/edit`)} className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:bg-white/10"><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setDeleteId(a.id)} className="rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-white/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {a.batch && <p className="mb-1 text-xs text-white/40">Batch of {a.batch}</p>}
              {a.description && <p className="text-sm text-white/70">{a.description}</p>}
            </div>
          ))}
        </div>
      )}

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default AlumniPage;
