import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Testimonial } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import { getTestimonialByIdApi, createTestimonial, updateTestimonialApi } from "../api/testimonialsApi";

const TestimonialFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Testimonial, "id">>({
    name: "",
    message: "",
    course: "",
    image: "",
    role: "",
    content: "",
    avatar: "",
    rating: 5,
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const testimonial = await getTestimonialByIdApi(id);
        setForm({
          name: testimonial.name,
          message: testimonial.message,
          course: testimonial.course,
          image: testimonial.image || "",
          role: testimonial.role || "",
          content: testimonial.content,
          avatar: testimonial.avatar || "",
          rating: testimonial.rating || 5,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateTestimonialApi(id, form);
      } else {
        await createTestimonial(form);
      }
      navigate("/testimonials");
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
        <PageHeader title={isEdit ? "Edit Testimonial" : "Add Testimonial"} description={isEdit ? "Update testimonial" : "Create a new testimonial"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>Role</Label><Input value={form.role} onChange={(e) => handleChange("role", e.target.value)} /></div>
          </div>
          <div className="flex flex-col gap-1.5"><Label>Avatar URL</Label><Input value={form.avatar} onChange={(e) => handleChange("avatar", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5">
            <Label>Rating (1-5)</Label>
            <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => handleChange("rating", Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1.5"><Label>Content</Label><Textarea value={form.content} onChange={(e) => handleChange("content", e.target.value)} rows={4} /></div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/testimonials")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Testimonial" : "Create Testimonial"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialFormPage;
