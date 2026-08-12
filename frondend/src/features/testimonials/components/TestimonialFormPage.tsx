import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Testimonial, TestimonialStatus } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import ImageUpload from "@shared/components/ImageUpload";
import { getImageUrl } from "@lib/imageUrl";
import {
  getTestimonialByIdApi,
  createTestimonial,
  updateTestimonialApi,
  uploadTestimonialImage,
  TESTIMONIAL_IMAGE_MAX_SIZE_BYTES,
} from "../api/testimonialsApi";

type TestimonialFormValues = {
  name: string;
  role: string;
  avatarUrl: string;
  content: string;
  status: TestimonialStatus;
};

type FormErrors = Partial<Record<keyof TestimonialFormValues, string>>;

const initialForm = (): TestimonialFormValues => ({
  name: "",
  role: "",
  avatarUrl: "",
  content: "",
  status: "Active",
});

const TestimonialFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<TestimonialFormValues>(initialForm);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const testimonial = await getTestimonialByIdApi(id);
        if (!testimonial) {
          toast.error("Testimonial not found");
          navigate("/testimonials");
          return;
        }
        setForm({
          name: testimonial.name || "",
          role: testimonial.role || "",
          avatarUrl: testimonial.avatarUrl || "",
          content: testimonial.content || "",
          status: testimonial.status || "Active",
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id, navigate]);

  const handleChange = <K extends keyof TestimonialFormValues>(
    field: K,
    value: TestimonialFormValues[K],
  ) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.content.trim()) nextErrors.content = "Content is required.";
    if (!form.status) nextErrors.status = "Status is required.";
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const payload: Omit<Testimonial, "id"> = {
      name: form.name,
      role: form.role,
      avatarUrl: form.avatarUrl,
      content: form.content,
      status: form.status,
    };

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateTestimonialApi(id, payload);
        toast.success("Testimonial updated successfully");
      } else {
        await createTestimonial(payload);
        toast.success("Testimonial created successfully");
      }
      navigate("/testimonials");
    } catch (e) {
      console.error(e);
      toast.error(isEdit ? "Failed to update testimonial" : "Failed to create testimonial");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading testimonial…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button type="button" onClick={() => navigate("/testimonials")} className="mb-2 inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Testimonials
        </button>
        <PageHeader title={isEdit ? "Edit Testimonial" : "Add Testimonial"} description={isEdit ? "Update testimonial information" : "Create a new testimonial"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>
                Name <span className="text-red-400">*</span>
              </Label>
              <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Enter testimonial name" />
              {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Role / Designation</Label>
              <Input value={form.role} onChange={(e) => handleChange("role", e.target.value)} placeholder="Enter role or designation" />
              {errors.role && <p className="text-xs text-red-300">{errors.role}</p>}
            </div>
          </div>

          <ImageUpload
            value={getImageUrl(form.avatarUrl, "testimonials")}
            onChange={(url) => handleChange("avatarUrl", url)}
            uploadFile={uploadTestimonialImage}
            label="Profile Image"
            maxSizeBytes={TESTIMONIAL_IMAGE_MAX_SIZE_BYTES}
            hint="PNG, JPG, WEBP up to 2MB"
          />

          <div className="flex flex-col gap-1.5">
            <Label>
              Testimonial Content <span className="text-red-400">*</span>
            </Label>
            <Textarea value={form.content} onChange={(e) => handleChange("content", e.target.value)} rows={6} placeholder="Write the testimonial content..." />
            {errors.content && <p className="text-xs text-red-300">{errors.content}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>
              Status <span className="text-red-400">*</span>
            </Label>
            <Select value={form.status} onValueChange={(v) => handleChange("status", v as TestimonialStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-xs text-red-300">{errors.status}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
          <Button variant="outline" onClick={() => navigate("/testimonials")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {saving
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Testimonial"
                : "Create Testimonial"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialFormPage;
