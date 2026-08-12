import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { NewsItem } from "../types";
import { getNewsById } from "../api/newsApi";
import { getImageUrl } from "@lib/imageUrl";

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        setArticle(await getNewsById(id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading article…</span>
      </div>
    );
  }

  if (!article) {
    return <div className="p-8 text-center text-white/50">Article not found.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/news" className="inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <article className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <h1 className="mb-2 text-2xl font-bold text-white">{article.title}</h1>
        <div className="mb-4 flex items-center gap-3 text-sm text-white/40">
          <span>{article.articleDate}</span>
        </div>
        {article.imageUrl && (
          <img src={getImageUrl(article.imageUrl, "articles")} alt={article.title} className="mb-4 w-full rounded-lg object-cover" />
        )}
        <div className="prose prose-invert max-w-none text-white/80">
          <p>{article.details}</p>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;
