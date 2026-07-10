import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Loader2 } from "lucide-react";
import type { Branch } from "../types";
import PageHeader from "@shared/components/PageHeader";
import DeleteModal from "@shared/components/DeleteModal";
import { Button } from "@shared/components/ui/button";
import { getBranches, deleteBranchApi } from "../api/branchesApi";

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
            <div key={b.id} className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-white">{b.name}</h3>
                <div className="flex gap-1">
                  <button type="button" onClick={() => navigate(`/branches/${b.id}/edit`)} className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:bg-white/10"><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setDeleteId(b.id)} className="rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-white/10"><Pencil className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mb-1 text-sm text-white/60">{b.address}</p>
              <p className="text-xs text-white/40">{b.city}, {b.state}</p>
            </div>
          ))}
        </div>
      )}

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default BranchesPage;
