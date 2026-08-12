import { useEffect, useRef, useState } from "react";
import { Phone, Mail, ExternalLink, Loader2, Download } from "lucide-react";
import { Link } from "react-router-dom";
import type { Enquiry } from "../types";
import PageHeader from "@shared/components/PageHeader";
import StatusBadge from "@shared/components/StatusBadge";
import { Button } from "@shared/components/ui/button";
import { ResponsiveTable } from "@shared/components/ui/ResponsiveTable";
import { getEnquiries, updateEnquiryStatus } from "../api/enquiriesApi";
import { formatEnquiryDate, exportEnquiriesToExcel } from "../utils";

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        setEnquiries(await getEnquiries());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop - clientHeight < 100 && visibleCount < enquiries.length) {
      setVisibleCount((prev) => Math.min(prev + 10, enquiries.length));
    }
  };

  const updateStatus = async (id: string, status: Enquiry["status"]) => {
    const prev = enquiries.find((e) => e.id === id)?.status;
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    try {
      await updateEnquiryStatus(id, status);
    } catch (err) {
      console.error(err);
      if (prev) {
        setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status: prev } : e)));
      }
    }
  };

  const handleExport = () => {
    exportEnquiriesToExcel(enquiries);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description={isLoading ? "Loading…" : `${enquiries.length} total enquiries`}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || enquiries.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading enquiries…</span>
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="hide-scrollbar max-h-[70vh] overflow-y-auto rounded-xl border border-white/10"
        >
          <ResponsiveTable
            data={enquiries.slice(0, visibleCount)}
            columns={[
              {
                key: "name",
                header: "Name",
                render: (item) => (
                  <Link
                    to={`/enquiries/${(item as Enquiry).id}`}
                    className="flex items-center gap-2 text-blue-400 underline-offset-2 hover:underline"
                  >
                    {(item as Enquiry).name}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ),
                cellClassName: "text-sm font-medium text-white/90",
              },
              {
                key: "email",
                header: "Email",
                render: (item) => (
                  <a href={`mailto:${(item as Enquiry).email}`} className="flex items-center gap-1 text-blue-300 underline-offset-2 hover:underline">
                    <Mail className="h-3 w-3" />
                    {(item as Enquiry).email}
                  </a>
                ),
                cellClassName: "text-sm text-white/70",
              },
              {
                key: "phone",
                header: "Phone",
                render: (item) => (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-white/40" />
                    {(item as Enquiry).phone}
                  </span>
                ),
                cellClassName: "text-sm text-white/55",
              },
              {
                key: "course",
                header: "Course / Subject",
                render: (item) => (
                  <span className="text-sm text-white/60">
                    {(item as Enquiry).course || "—"}
                  </span>
                ),
                cellClassName: "text-sm text-white/55",
              },
              {
                key: "date",
                header: "Date",
                render: (item) => (
                  <span className="text-sm text-white/60">
                    {formatEnquiryDate((item as Enquiry).date)}
                  </span>
                ),
                cellClassName: "text-sm text-white/55",
              },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <select
                    value={(item as Enquiry).status}
                    onChange={(e) => void updateStatus((item as Enquiry).id, e.target.value as Enquiry["status"])}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                ),
                cellClassName: "text-sm",
                renderMobile: (item) => <StatusBadge status={(item as Enquiry).status} />,
              },
            ]}
            renderActions={(item) => (
              <Link
                to={`/enquiries/${(item as Enquiry).id}`}
                className="rounded-lg p-2 text-blue-400 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default EnquiriesPage;
