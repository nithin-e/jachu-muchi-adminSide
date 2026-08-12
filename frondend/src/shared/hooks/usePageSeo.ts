import { useEffect, useRef, useState } from "react";
import { getSeoByPageUrl } from "@features/seo/api/seoApi";

export interface PageSeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  loading: boolean;
}

export interface PageSeoFallback {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const DEFAULT_TITLE = "Jachu Muchi";
const DEFAULT_DESCRIPTION =
  "Official website of Jachu Muchi — courses, contact and latest updates.";

export const usePageSeo = (
  pageUrl: string,
  fallback?: PageSeoFallback,
): PageSeo => {
  const fallbackRef = useRef<PageSeoFallback | undefined>(fallback);
  fallbackRef.current = fallback;

  const [seo, setSeo] = useState<PageSeo>({
    metaTitle: fallback?.metaTitle || DEFAULT_TITLE,
    metaDescription: fallback?.metaDescription || DEFAULT_DESCRIPTION,
    metaKeywords: fallback?.metaKeywords || "",
    loading: true,
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const record = await getSeoByPageUrl(pageUrl);
        if (!active) return;
        const fb = fallbackRef.current;
        setSeo({
          metaTitle:
            record?.metaTitle?.trim() || fb?.metaTitle || DEFAULT_TITLE,
          metaDescription:
            record?.metaDescription?.trim() ||
            fb?.metaDescription ||
            DEFAULT_DESCRIPTION,
          metaKeywords:
            record?.metaKeywords?.trim() || fb?.metaKeywords || "",
          loading: false,
        });
      } catch (e) {
        console.error(e);
        if (!active) return;
        setSeo((prev) => ({ ...prev, loading: false }));
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [pageUrl]);

  return seo;
};
