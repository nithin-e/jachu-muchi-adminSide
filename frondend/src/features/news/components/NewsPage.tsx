import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Loader2 } from "lucide-react";
import type { NewsItem } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { ResponsiveTable } from "@shared/components/ui/ResponsiveTable";
import { getNews } from "../api/newsApi";

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setNews(await getNews());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="News"
        description={loading ? "Loading…" : `${news.length} articles`}
        action={
          <Button size="sm" onClick={() => {}}>
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
            { key: "author", header: "Author", cellClassName: "text-sm text-white/70" },
            { key: "date", header: "Date", cellClassName: "text-sm text-white/55" },
          ]}
          renderActions={(item) => (
            <Link
              to={`/news/${item.id}`}
              className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
        />
      )}
    </div>
  );
};

export default NewsPage;
