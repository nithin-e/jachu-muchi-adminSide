import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Branch, BranchStatus } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { getBranchById, createBranch, updateBranchApi } from "../api/branchesApi";

const BranchFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Branch, "id">>({
    name: "",
    phoneNumbers: [],
    email: "",
    location: "",
    mapUrl: "",
    status: "Active",
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const branch = await getBranchById(id);
        setForm({
          name: branch.name,
          phoneNumbers: branch.phoneNumbers,
          email: branch.email,
          location: branch.location,
          mapUrl: branch.mapUrl,
          status: branch.status,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleChange = <K extends keyof Omit<Branch, "id">>(
    field: K,
    value: Omit<Branch, "id">[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    const phoneNumbers = value
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, phoneNumbers }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateBranchApi(id, form);
      } else {
        await createBranch(form);
      }
      navigate("/branches");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading branch…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button type="button" onClick={() => navigate("/branches")} className="mb-2 inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Branches
        </button>
        <PageHeader title={isEdit ? "Edit Branch" : "Add Branch"} description={isEdit ? "Update branch information" : "Create a new branch"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5"><Label>Branch Name</Label><Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Phone</Label><Input value={form.phoneNumbers.join(", ")} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="+91 9400920044, +91 9876543210" /></div>
          <div className="flex flex-col gap-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => handleChange("location", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Map URL</Label><Input value={form.mapUrl} onChange={(e) => handleChange("mapUrl", e.target.value)} placeholder="https://www.google.com/maps/..." /></div>
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => handleChange("status", v as BranchStatus)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/branches")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Branch" : "Create Branch"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchFormPage;
