import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Banner } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Switch } from "@shared/components/ui/switch";
import { getBannerById, createBanner, updateBannerApi, uploadBannerImage, BANNER_IMAGE_MAX_SIZE_BYTES } from "../api/bannersApi";
import ImageUpload from "@shared/components/ImageUpload";

type FormValue = string | boolean | number;

type FormErrors = Partial<Record<keyof Omit<Banner, "id">, string>>;

const initialForm: Omit<Banner, "id"> = {
  heading: "",
  highlightedText: "",
  subtext: "",
  primaryButtonText: "",
  secondaryButtonText: "",
  order: 1,
  image: "",
  status: "Active",
};

const validateForm = (form: Omit<Banner, "id">): FormErrors => {
  const errors: FormErrors = {};
  if (!form.image.trim()) errors.image = "Image is required.";
  if (!form.heading.trim()) errors.heading = "Heading is required.";
  if (!Number.isFinite(form.order) || form.order < 0) errors.order = "Order must be 0 or greater.";
  return errors;
};

const EditBannerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Banner, "id">>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const banner = await getBannerById(id);
        if (banner) {
          setForm({
            heading: banner.heading,
            highlightedText: banner.highlightedText,
            subtext: banner.subtext,
            primaryButtonText: banner.primaryButtonText,
            secondaryButtonText: banner.secondaryButtonText,
            order: banner.order,
            image: banner.image,
            status: banner.status,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleChange = (field: keyof Omit<Banner, "id">, value: FormValue) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
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
          <div className="flex flex-col gap-1.5">
            <Label>Heading</Label>
            <Input value={form.heading} placeholder="Excellence in Management Education" onChange={(e) => handleChange("heading", e.target.value)} />
            {errors.heading && <p className="text-xs text-red-300">{errors.heading}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Highlighted Text (shown inside the dark box)</Label>
            <Input value={form.highlightedText} placeholder="Management" onChange={(e) => handleChange("highlightedText", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Subtext</Label>
            <Input value={form.subtext} onChange={(e) => handleChange("subtext", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Primary Button Text</Label>
              <Input value={form.primaryButtonText} placeholder="View Courses" onChange={(e) => handleChange("primaryButtonText", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Secondary Button Text</Label>
              <Input value={form.secondaryButtonText} placeholder="Learn More" onChange={(e) => handleChange("secondaryButtonText", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Order (lower = earlier slide)</Label>
              <Input type="number" min={0} value={String(form.order)} onChange={(e) => handleChange("order", Number(e.target.value))} />
              {errors.order && <p className="text-xs text-red-300">{errors.order}</p>}
            </div>
            <div className="flex items-end gap-3 pb-1">
              <div className="flex flex-col gap-1.5">
                <Label>Active</Label>
                <div className="flex items-center gap-3">
                  <Switch checked={form.status === "Active"} onCheckedChange={(v) => handleChange("status", v ? "Active" : "Inactive")} />
                  <span className="text-sm text-white/70">{form.status === "Active" ? "Visible on homepage" : "Hidden from homepage"}</span>
                </div>
              </div>
            </div>
          </div>
          <ImageUpload
            value={form.image}
            onChange={(url) => handleChange("image", url)}
            uploadFile={uploadBannerImage}
            label="Image"
            maxSizeBytes={BANNER_IMAGE_MAX_SIZE_BYTES}
            hint="PNG, JPG, WEBP up to 10MB"
          />
          {errors.image && <p className="text-xs text-red-300">{errors.image}</p>}
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
