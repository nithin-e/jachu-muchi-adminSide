import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Banner } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Switch } from "@shared/components/ui/switch";
import { getBannerById, createBanner, updateBannerApi } from "../api/bannersApi";

const EditBannerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Banner, "id">>({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    active: true,
    status: "Active",
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const banner = await getBannerById(id);
        setForm({
          title: banner.title,
          subtitle: banner.subtitle || "",
          image: banner.image,
          link: banner.link || "",
          active: banner.active,
          status: banner.status,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateBannerApi(id, form);
      } else {
        await createBanner(form);
      }
      navigate("/banners");
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
        <span className="text-sm">Loading banner…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button type="button" onClick={() => navigate("/banners")} className="mb-2 inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Banners
        </button>
        <PageHeader title={isEdit ? "Edit Banner" : "Add Banner"} description={isEdit ? "Update banner information" : "Create a new banner"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Subtitle</Label><Input value={form.subtitle} onChange={(e) => handleChange("subtitle", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Image URL</Label><Input value={form.image} onChange={(e) => handleChange("image", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Link</Label><Input value={form.link} onChange={(e) => handleChange("link", e.target.value)} /></div>
          <div className="flex items-center gap-3">
            <Switch checked={form.active} onCheckedChange={(v) => handleChange("active", v)} />
            <Label>Active</Label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/banners")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Banner" : "Create Banner"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditBannerPage;
