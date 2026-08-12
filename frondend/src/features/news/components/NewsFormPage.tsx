import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { NewsItem } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import ImageUpload from "@shared/components/ImageUpload";
import { getNewsById, createNews, updateNews, uploadNewsImage, NEWS_IMAGE_MAX_SIZE_BYTES } from "../api/newsApi";

type FormErrors = Partial<Record<keyof Omit<NewsItem, "id">, string>>;

const todayString = (): string => new Date().toISOString().split("T")[0];

const initialForm = (): Omit<NewsItem, "id"> => ({
  title: "",
  description: "",
  details: "",
  articleDate: todayString(),
  status: "Published",
  imageUrl: "",
});

const NewsFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<Omit<NewsItem, "id">>(initialForm);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const article = await getNewsById(id);
        if (article) {
          setForm({
            title: article.title,
            description: article.description,
            details: article.details,
            articleDate: article.articleDate,
            status: article.status,
            imageUrl: article.imageUrl,
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

  const handleChange = (field: keyof typeof form, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const nextErrors: FormErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.details.trim()) nextErrors.details = "Details are required.";
    if (!form.articleDate.trim()) nextErrors.articleDate = "Article date is required.";
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateNews(id, form);
        toast.success("News updated successfully");
      } else {
        await createNews(form);
        toast.success("News created successfully");
      }
      navigate("/news");
    } catch (e) {
      console.error(e);
      toast.error(isEdit ? "Failed to update news" : "Failed to create news");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading news…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button type="button" onClick={() => navigate("/news")} className="mb-2 inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </button>
        <PageHeader title={isEdit ? "Edit News" : "Add News"} description={isEdit ? "Update news information" : "Create a new news item"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="News headline" />
            {errors.title && <p className="text-xs text-red-300">{errors.title}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} placeholder="Short summary of the news" />
            {errors.description && <p className="text-xs text-red-300">{errors.description}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Details</Label>
            <Textarea value={form.details} onChange={(e) => handleChange("details", e.target.value)} rows={8} placeholder="Detailed content of the news" />
            {errors.details && <p className="text-xs text-red-300">{errors.details}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Article Date</Label>
            <Input type="date" value={form.articleDate} onChange={(e) => handleChange("articleDate", e.target.value)} />
            {errors.articleDate && <p className="text-xs text-red-300">{errors.articleDate}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => handleChange("imageUrl", url)}
            uploadFile={uploadNewsImage}
            label="Image"
            maxSizeBytes={NEWS_IMAGE_MAX_SIZE_BYTES}
            hint="PNG, JPG, WEBP up to 10MB"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/news")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Update News" : "Save News"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsFormPage;
