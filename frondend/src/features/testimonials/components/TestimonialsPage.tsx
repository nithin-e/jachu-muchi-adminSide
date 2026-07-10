import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Loader2, Trash2 } from "lucide-react";
import type { Testimonial } from "../types";
import PageHeader from "@shared/components/PageHeader";
import DeleteModal from "@shared/components/DeleteModal";
import { Button } from "@shared/components/ui/button";
import { getTestimonials, deleteTestimonialApi } from "../api/testimonialsApi";

const TestimonialsPage = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setTestimonials(await getTestimonials());
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
    setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
    try {
      await deleteTestimonialApi(deleteId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description={loading ? "Loading…" : `${testimonials.length} testimonials`}
        action={
          <Button size="sm" onClick={() => navigate("/testimonials/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Add Testimonial
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading testimonials…</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-8 text-center text-sm text-white/50">No testimonials found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {t.avatar && (
                    <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  )}
                  <div>
                    <h3 className="font-medium text-white">{t.name}</h3>
                    {t.role && <p className="text-xs text-white/50">{t.role}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => navigate(`/testimonials/${t.id}/edit`)} className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:bg-white/10"><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setDeleteId(t.id)} className="rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-white/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="text-sm italic text-white/70">"{t.content}"</p>
              {t.rating && (
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-sm ${i < (t.rating ?? 0) ? "text-yellow-400" : "text-white/20"}`}>★</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default TestimonialsPage;
