import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Store } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { getStoreById, createStore, updateStore } from "../api/storesApi";

const StoreFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Store, "id">>({
    name: "",
    description: "",
    images: [],
    status: "Active",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const store = await getStoreById(id);
        setForm({
          name: store.name,
          description: store.description,
          images: store.images,
          status: store.status,
          address: store.address || "",
          city: store.city || "",
          state: store.state || "",
          zip: store.zip || "",
          phone: store.phone || "",
          email: store.email || "",
          image: store.image || "",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateStore(id, form);
      } else {
        await createStore(form);
      }
      navigate("/stores");
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
        <span className="text-sm">Loading store…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button type="button" onClick={() => navigate("/stores")} className="mb-2 inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Stores
        </button>
        <PageHeader title={isEdit ? "Edit Store" : "Add Store"} description={isEdit ? "Update store information" : "Create a new store"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5"><Label>Store Name</Label><Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Address</Label><Input value={form.address} onChange={(e) => handleChange("address", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>City</Label><Input value={form.city} onChange={(e) => handleChange("city", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>State</Label><Input value={form.state} onChange={(e) => handleChange("state", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>ZIP</Label><Input value={form.zip} onChange={(e) => handleChange("zip", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Image URL</Label><Input value={form.image} onChange={(e) => handleChange("image", e.target.value)} /></div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/stores")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Store" : "Create Store"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreFormPage;
