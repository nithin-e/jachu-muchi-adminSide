import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import type { SeoFormValues } from "../types";
import { getSeoByPageUrl, upsertSeo } from "../api/seoApi";

interface SeoEditorProps {
  pageUrl: string;
  onSaved?: () => void;
}

const emptyForm: SeoFormValues = {
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

const SeoEditor = ({ pageUrl, onSaved }: SeoEditorProps) => {
  const [form, setForm] = useState<SeoFormValues>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const record = await getSeoByPageUrl(pageUrl);
        setForm({
          metaTitle: record?.metaTitle ?? "",
          metaDescription: record?.metaDescription ?? "",
          metaKeywords: record?.metaKeywords ?? "",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [pageUrl]);

  const handleChange = (field: keyof SeoFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertSeo(pageUrl, form);
      toast.success(`SEO metadata saved for ${pageUrl || "/"}`);
      onSaved?.();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save SEO metadata");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading SEO metadata…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <Label>Meta Title</Label>
        <Input
          value={form.metaTitle}
          placeholder="Page title shown in search results"
          onChange={(e) => handleChange("metaTitle", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Meta Description</Label>
        <Textarea
          value={form.metaDescription}
          placeholder="Short summary shown in search results"
          onChange={(e) => handleChange("metaDescription", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Meta Keywords (comma-separated)</Label>
        <Input
          value={form.metaKeywords}
          placeholder="keyword one, keyword two"
          onChange={(e) => handleChange("metaKeywords", e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button disabled={saving} onClick={() => void handleSave()}>
          {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
};

export default SeoEditor;
