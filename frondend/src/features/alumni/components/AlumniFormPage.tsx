import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Alumni } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import ImageUpload from "@shared/components/ImageUpload";
import { getImageUrl } from "@lib/imageUrl";
import { getAlumniById, createAlumni, updateAlumniApi } from "../api/alumniApi";

const ALUMNI_IMAGE_MAX_SIZE_BYTES = 10 * 1024 * 1024;

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });

type FormErrors = Partial<Record<keyof Omit<Alumni, "id">, string>>;

const AlumniFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<Omit<Alumni, "id">>({
    name: "",
    role: "",
    company: "",
    place: "",
    image: "",
    batch: "",
    description: "",
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const alumnus = await getAlumniById(id);
        setForm({
          name: alumnus.name,
          role: alumnus.role || "",
          company: alumnus.company,
          place: alumnus.place,
          image: alumnus.image || "",
          batch: alumnus.batch || "",
          description: alumnus.description || "",
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
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.role.trim()) nextErrors.role = "Role is required.";
    if (!form.company.trim()) nextErrors.company = "Company is required.";
    if (!form.place.trim()) nextErrors.place = "Place is required.";
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateAlumniApi(id, form);
      } else {
        await createAlumni(form);
      }
      navigate("/alumni");
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
        <span className="text-sm">Loading alumni…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button type="button" onClick={() => navigate("/alumni")} className="mb-2 inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Alumni
        </button>
        <PageHeader title={isEdit ? "Edit Alumni" : "Add Alumni"} description={isEdit ? "Update alumni information" : "Add a new alumni member"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Role</Label>
              <Input value={form.role} onChange={(e) => handleChange("role", e.target.value)} />
              {errors.role && <p className="text-xs text-red-300">{errors.role}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Batch</Label>
              <Input value={form.batch} onChange={(e) => handleChange("batch", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
              {errors.company && <p className="text-xs text-red-300">{errors.company}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Place</Label>
            <Input value={form.place} onChange={(e) => handleChange("place", e.target.value)} placeholder="City where the alumnus works" />
            {errors.place && <p className="text-xs text-red-300">{errors.place}</p>}
          </div>
          <ImageUpload
            value={getImageUrl(form.image, "alumni")}
            onChange={(url) => handleChange("image", url)}
            uploadFile={fileToDataUrl}
            label="Image"
            maxSizeBytes={ALUMNI_IMAGE_MAX_SIZE_BYTES}
            hint="PNG, JPG up to 10MB"
          />
          <div className="flex flex-col gap-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} /></div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/alumni")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Alumni" : "Create Alumni"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlumniFormPage;
