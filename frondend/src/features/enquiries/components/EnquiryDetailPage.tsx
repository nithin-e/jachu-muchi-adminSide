import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Enquiry } from "../types";
import StatusBadge from "@shared/components/StatusBadge";
import { Button } from "@shared/components/ui/button";
import { getEnquiryById, updateEnquiryStatus } from "../api/enquiriesApi";

const EnquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        setEnquiry(await getEnquiryById(id));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id]);

  const updateStatus = async (status: Enquiry["status"]) => {
    if (!enquiry || !id) return;
    const prev = enquiry.status;
    setEnquiry({ ...enquiry, status });
    setUpdating(true);
    try {
      await updateEnquiryStatus(id, status);
    } catch (err) {
      console.error(err);
      setEnquiry({ ...enquiry, status: prev });
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading enquiry…</span>
      </div>
    );
  }

  if (!enquiry) {
    return <div className="p-8 text-center text-white/50">Enquiry not found.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/enquiries" className="inline-flex items-center gap-1 text-sm text-blue-400 underline-offset-2 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Enquiries
      </Link>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">{enquiry.name}</h1>
          <StatusBadge status={enquiry.status} />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-white/40">Email</span><p className="text-white/90">{enquiry.email}</p></div>
          <div><span className="text-white/40">Phone</span><p className="text-white/90">{enquiry.phone}</p></div>
          {enquiry.course && <div><span className="text-white/40">Course</span><p className="text-white/90">{enquiry.course}</p></div>}
          <div><span className="text-white/40">Date</span><p className="text-white/90">{enquiry.date}</p></div>
        </div>

        <div className="mb-4">
          <span className="text-sm text-white/40">Message</span>
          <p className="mt-1 whitespace-pre-wrap rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white/80">{enquiry.message}</p>
        </div>

        {enquiry.notes && (
          <div className="mb-4">
            <span className="text-sm text-white/40">Admin Notes</span>
            <p className="mt-1 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white/80">{enquiry.notes}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm text-white/40">Update Status:</span>
          <div className="flex gap-2">
            {(["New", "Contacted", "Interested", "Converted", "Closed"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={enquiry.status === s ? "default" : "outline"}
                disabled={updating}
                onClick={() => void updateStatus(s)}
                className="text-xs capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
          {updating && <Loader2 className="h-4 w-4 animate-spin text-white/40" />}
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetailPage;
