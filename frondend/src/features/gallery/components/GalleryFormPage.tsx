import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { GalleryItem, GalleryCategory } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { getGalleryItemById, createGalleryItem, updateGalleryItem } from "../api/galleryApi";
import ImageUpload from "@shared/components/ImageUpload";

const GALLERY_CATEGORIES: GalleryCategory[] = ["Campus", "Labs", "Events"];
const GALLERY_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

type FormErrors = Partial<Record<keyof Omit<GalleryItem, "id" | "category">, string>>;

const initialForm: Omit<GalleryItem, "id"> = {
  title: "",
  category: "Campus",
  image: "",
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });

const GalleryFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, "id">>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const item = await getGalleryItemById(id);
        if (item) {
          setForm({
            title: item.title,
            category: item.category,
            image: item.image,
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

  const handleChange = <K extends keyof Omit<GalleryItem, "id">>(
    field: K,
    value: Omit<GalleryItem, "id">[K],
  ) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const nextErrors: FormErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!form.image.trim()) nextErrors.image = "Image is required.";
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateGalleryItem(id, form);
      } else {
        await createGalleryItem(form);
      }
      navigate("/gallery");
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
        <span className="text-sm">Loading gallery item…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button type="button" onClick={() => navigate("/gallery")} className="mb-2 inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </button>
        <PageHeader title={isEdit ? "Edit Image" : "Add Image"} description={isEdit ? "Update gallery image information" : "Add a new image to the gallery"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label>Title</Label>
            <Input value={form.title} placeholder="Campus Main Gate" onChange={(e) => handleChange("title", e.target.value)} />
            {errors.title && <p className="text-xs text-red-300">{errors.title}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => handleChange("category", v as GalleryCategory)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {GALLERY_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ImageUpload
            value={form.image}
            onChange={(url) => handleChange("image", url)}
            uploadFile={fileToDataUrl}
            label="Image"
            maxSizeBytes={GALLERY_IMAGE_MAX_SIZE_BYTES}
            hint="PNG, JPG up to 5MB"
          />
          {errors.image && <p className="text-xs text-red-300">{errors.image}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/gallery")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Image" : "Add Image"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GalleryFormPage;
