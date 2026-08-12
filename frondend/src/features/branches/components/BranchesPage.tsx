import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Loader2, Trash2, MapPin, Phone, Mail } from "lucide-react";
import type { Branch } from "../types";
import PageHeader from "@shared/components/PageHeader";
import DeleteModal from "@shared/components/DeleteModal";
import StatusBadge from "@shared/components/StatusBadge";
import { Button } from "@shared/components/ui/button";
import { getBranches, deleteBranchApi } from "../api/branchesApi";

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const toTelHref = (phone: string): string => `tel:${phone.replace(/[^+\d]/g, "")}`;

const BranchesPage = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setBranches(await getBranches());
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
    setBranches((prev) => prev.filter((b) => b.id !== deleteId));
    setDeleteId(null);
    try {
      await deleteBranchApi(deleteId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branches"
        description={loading ? "Loading…" : `${branches.length} branches`}
        action={
          <Button size="sm" onClick={() => navigate("/branches/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Add Branch
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading branches…</span>
        </div>
      ) : branches.length === 0 ? (
        <div className="p-8 text-center text-sm text-white/50">No branches found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <div key={b.id} className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="min-w-0 break-words font-medium text-white">{b.name}</h3>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => navigate(`/branches/edit/${b.id}`)} className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:bg-white/10"><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setDeleteId(b.id)} className="rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-white/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              {b.location && (
                <p className="mb-3 break-words text-sm leading-relaxed text-white/60">{b.location}</p>
              )}

              <div className="flex-1 space-y-3">
                {b.phoneNumbers.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-white/40">Phone</p>
                    <div className="space-y-1">
                      {b.phoneNumbers.map((phone) => (
                        <a
                          key={phone}
                          href={toTelHref(phone)}
                          className="flex items-center gap-1.5 break-all text-sm text-blue-300 underline-offset-2 hover:underline"
                        >
                          <Phone className="h-3.5 w-3.5 shrink-0 text-white/40" />
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {b.email && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-white/40">Email</p>
                    <a
                      href={`mailto:${b.email}`}
                      className="flex items-center gap-1.5 break-all text-sm text-blue-300 underline-offset-2 hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0 text-white/40" />
                      {b.email}
                    </a>
                  </div>
                )}

                {b.status && (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-white/40">Status</p>
                    <StatusBadge status={b.status} />
                  </div>
                )}
              </div>

              {b.mapUrl && isHttpUrl(b.mapUrl) && (
                <a
                  href={b.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-300 transition-all duration-200 hover:bg-white/10"
                >
                  <MapPin className="h-4 w-4" />
                  View on Map
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default BranchesPage;
