import { useCallback, useEffect, useMemo, useState } from "react";
import { FileSearch, Loader2, Pencil } from "lucide-react";
import PageHeader from "@shared/components/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { ResponsiveTable } from "@shared/components/ui/ResponsiveTable";
import { SEO_PAGE_URLS } from "../constants";
import type { SeoMeta } from "../types";
import { getSeoRecords } from "../api/seoApi";
import SeoEditor from "./SeoEditor";

interface SeoRow {
  id: string;
  pageUrl: string;
  status: "Filled" | "Empty";
}

const SeoPage = () => {
  const [records, setRecords] = useState<SeoMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPageUrl, setEditingPageUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setRecords(await getSeoRecords());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows: SeoRow[] = useMemo(() => {
    const byUrl = new Map(records.map((record) => [record.pageUrl, record]));
    return SEO_PAGE_URLS.map((pageUrl) => {
      const record = byUrl.get(pageUrl);
      const filled = Boolean(
        record?.metaTitle?.trim() || record?.metaDescription?.trim(),
      );
      return { id: pageUrl, pageUrl, status: filled ? "Filled" : "Empty" };
    });
  }, [records]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO Metadata"
        description={
          isLoading
            ? "Loading…"
            : `${rows.length} pages · manage meta title, description and keywords`
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading SEO metadata…</span>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-white/10">
          <ResponsiveTable
            data={rows}
            columns={[
              {
                key: "pageUrl",
                header: "Page URL",
                render: (item) => (
                  <span className="flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-blue-400" />
                    <code className="rounded bg-white/5 px-2 py-0.5 text-xs text-blue-300">
                      {(item as SeoRow).pageUrl}
                    </code>
                  </span>
                ),
                cellClassName: "text-sm font-medium text-white/90",
              },
              {
                key: "status",
                header: "Status",
                render: (item) => {
                  const isFilled = (item as SeoRow).status === "Filled";
                  return (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                        isFilled
                          ? "border border-green-400/20 bg-green-400/10 text-green-300"
                          : "border border-white/10 bg-white/5 text-white/60"
                      }`}
                    >
                      {(item as SeoRow).status}
                    </span>
                  );
                },
                cellClassName: "text-sm",
              },
            ]}
            renderActions={(item) => (
              <button
                type="button"
                onClick={() => setEditingPageUrl((item as SeoRow).pageUrl)}
                className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10"
                aria-label={`Edit SEO for ${(item as SeoRow).pageUrl}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          />
        </div>
      )}

      <Dialog
        open={editingPageUrl !== null}
        onOpenChange={(open) => {
          if (!open) setEditingPageUrl(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit SEO — {editingPageUrl ?? ""}</DialogTitle>
            <DialogDescription>
              Set the meta title, description and keywords for this page.
            </DialogDescription>
          </DialogHeader>
          {editingPageUrl && (
            <SeoEditor
              pageUrl={editingPageUrl}
              onSaved={() => {
                setEditingPageUrl(null);
                void load();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeoPage;
