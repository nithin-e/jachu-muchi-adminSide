import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { NewsItem } from "../types";
import PageHeader from "@shared/components/PageHeader";
import DeleteModal from "@shared/components/DeleteModal";
import { Button } from "@shared/components/ui/button";
import { ResponsiveTable } from "@shared/components/ui/ResponsiveTable";
import { getNews, deleteNews } from "../api/newsApi";

const NewsPage = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setNews(await getNews());
    } catch (e) {
      console.error(e);
      toast.error("Failed to load news articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteNews(deleteId);
      setNews((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("Article deleted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete article");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="News"
        description={loading ? "Loading…" : `${news.length} articles`}
        action={
          <Button size="sm" onClick={() => navigate("/news/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Add Article
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading news…</span>
        </div>
      ) : news.length === 0 ? (
        <div className="p-8 text-center text-sm text-white/50">No news articles found.</div>
      ) : (
        <ResponsiveTable
          data={news}
          columns={[
            { key: "title", header: "Title", cellClassName: "text-sm font-medium text-white/90" },
            { key: "articleDate", header: "Date", cellClassName: "text-sm text-white/55" },
          ]}
          renderActions={(item) => (
            <div className="flex items-center justify-end gap-1">
              <Link
                to={`/news/${item.id}`}
                aria-label="View article"
                className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:bg-white/10"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <button
                type="button"
                aria-label="Edit article"
                onClick={() => navigate(`/news/edit/${item.id}`)}
                className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:bg-white/10"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete article"
                onClick={() => setDeleteId(item.id)}
                className="rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-white/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        />
      )}

      <DeleteModal
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
        title="Delete article"
        description="Are you sure you want to delete this article?"
      />
    </div>
  );
};

export default NewsPage;
