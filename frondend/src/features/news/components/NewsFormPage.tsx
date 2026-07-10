import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { NewsItem } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import { getNewsById, createNews, updateNews } from "../api/newsApi";

const NewsFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<NewsItem, "id">>({
    title: "",
    description: "",
    image: "",
    date: new Date().toISOString().split("T")[0],
    status: "Draft",
    content: "",
    author: "",
    excerpt: "",
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const article = await getNewsById(id);
        setForm({
          title: article.title,
          description: article.description,
          image: article.image || "",
          date: article.date,
          status: article.status,
          content: article.content,
          author: article.author,
          excerpt: article.excerpt || "",
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
        await updateNews(id, form);
      } else {
        await createNews(form);
      }
      navigate("/news");
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
        <span className="text-sm">Loading article…</span>
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
        <PageHeader title={isEdit ? "Edit Article" : "Add Article"} description={isEdit ? "Update article" : "Create a new article"} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Author</Label><Input value={form.author} onChange={(e) => handleChange("author", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} /></div>
          </div>
          <div className="flex flex-col gap-1.5"><Label>Image URL</Label><Input value={form.image} onChange={(e) => handleChange("image", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => handleChange("excerpt", e.target.value)} rows={2} /></div>
          <div className="flex flex-col gap-1.5"><Label>Content</Label><Textarea value={form.content} onChange={(e) => handleChange("content", e.target.value)} rows={8} /></div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/news")}>Cancel</Button>
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Article" : "Create Article"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsFormPage;
