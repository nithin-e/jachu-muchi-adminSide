import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { User } from "../types";
import PageHeader from "@shared/components/PageHeader";
import { ResponsiveTable } from "@shared/components/ui/ResponsiveTable";
import { getManagedUsers } from "../api/usersApi";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setUsers(await getManagedUsers());
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
        title="Users"
        description={loading ? "Loading…" : `${users.length} registered users`}
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading users…</span>
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center text-sm text-white/50">No users found.</div>
      ) : (
        <ResponsiveTable
          data={users}
          columns={[
            { key: "id", header: "ID", cellClassName: "text-sm font-medium text-white/90" },
            { key: "name", header: "Name", cellClassName: "text-sm text-white/85" },
            { key: "email", header: "Email", cellClassName: "text-sm text-white/70" },
            { key: "role", header: "Role", cellClassName: "text-sm text-white/55 capitalize" },
            { key: "status", header: "Status", cellClassName: "text-sm" },
          ]}
        />
      )}
    </div>
  );
};

export default UsersPage;
