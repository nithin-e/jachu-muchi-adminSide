import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Pencil, Trash2, User, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/shared/DeleteModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Alumni } from "@/lib/alumni-store";
import { deleteAlumniApi, getAlumniList } from "@/api/services/alumni.service";

const AlumniPage = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchList = async () => {
      setIsLoading(true);
      try {
        setAlumni(await getAlumniList());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchList();
  }, []);

  const filteredAndSortedAlumni = useMemo(() => {
    let result = [...alumni];

    // Filter
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query) ||
          item.company.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      const valA = String(a[sortBy as keyof Alumni] || "").toLowerCase();
      const valB = String(b[sortBy as keyof Alumni] || "").toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [alumni, search, sortBy, sortOrder]);

  const totalPages = useMemo(() => {
    const total = Math.ceil(filteredAndSortedAlumni.length / pageSize);
    return total > 0 ? total : 1;
  }, [filteredAndSortedAlumni.length, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, sortOrder, pageSize]);

  const paginatedAlumni = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSortedAlumni.slice(start, start + pageSize);
  }, [filteredAndSortedAlumni, page, pageSize]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setAlumni((prev) => prev.filter((item) => item.id !== deleteId));
    setDeleteId(null);
    try {
      await deleteAlumniApi(deleteId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni Management"
        description={
          isLoading
            ? "Loading alumni…"
            : search
              ? `${filteredAndSortedAlumni.length} results for "${search}"`
              : `${alumni.length} alumni profiles`
        }
        action={(
          <Button onClick={() => navigate("/alumni/add")} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Alumni
          </Button>
        )}
      />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, role or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 border-white/20 bg-white/5 pl-10 text-white placeholder:text-gray-500 hover:bg-white/10 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 w-32 border-white/20 bg-white/5 text-white hover:bg-white/10">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-slate-900 text-white">
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="h-10 w-32 border-white/20 bg-white/5 text-white hover:bg-white/10">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-slate-900 text-white">
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-6 w-[1px] bg-white/10 lg:mx-2" />

              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-32 border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900 text-white">
                  {[6, 9, 12, 15].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}/page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedAlumni.map((item) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#1e293b] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Image Section */}
                <div className="relative h-40 w-full bg-gradient-to-br from-slate-800/80 to-slate-900/90">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = "none";
                        img.nextElementSibling?.removeAttribute("style");
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-16 w-16 text-white/25" aria-hidden />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-1 px-4 pt-4 pb-4">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.role}</p>
                    <p className="mt-2 text-sm font-medium text-blue-400">{item.company}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/alumni/edit/${item.id}`)}
                      className="rounded-lg bg-white/10 p-2 text-blue-300 transition-colors hover:bg-white/20"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-lg bg-white/10 p-2 text-red-300 transition-colors hover:bg-white/20"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedAlumni.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-white/5 p-6 mb-4">
                <Search className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">No alumni found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
              <Button
                variant="ghost"
                className="mt-4 text-blue-400 hover:text-blue-300"
                onClick={() => {
                  setSearch("");
                  setSortBy("name");
                  setSortOrder("asc");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>

                  {(() => {
                    const window = 2;
                    const start = Math.max(1, page - window);
                    const end = Math.min(totalPages, page + window);
                    const showLeftEllipsis = start > 1;
                    const showRightEllipsis = end < totalPages;
                    const pagesToShow: number[] = [];
                    for (let p = start; p <= end; p++) pagesToShow.push(p);

                    return (
                      <>
                        {showLeftEllipsis && (
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(1);
                              }}
                              isActive={page === 1}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        {showLeftEllipsis && <PaginationEllipsis />}

                        {pagesToShow.map((p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(p);
                              }}
                              isActive={p === page}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {showRightEllipsis && <PaginationEllipsis />}

                        {showRightEllipsis && (
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(totalPages);
                              }}
                              isActive={page === totalPages}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                      </>
                    );
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="mt-3 text-center text-sm text-gray-400">
                Showing{" "}
                {Math.min((page - 1) * pageSize + 1, filteredAndSortedAlumni.length)}-
                {Math.min(page * pageSize, filteredAndSortedAlumni.length)} of{" "}
                {filteredAndSortedAlumni.length}
              </div>
            </div>
          )}
        </>
      )}

      <DeleteModal
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete alumni"
      />
    </div>
  );
};

export default AlumniPage;