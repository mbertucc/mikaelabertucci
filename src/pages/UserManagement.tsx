import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

interface UserApproval {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  email?: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserApproval[]>([]);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin/login"); return; }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: session.user.id,
      _role: "admin",
    });
    if (!isAdmin) { navigate("/admin"); return; }

    await loadUsers();
    setLoading(false);
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from("user_approvals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) { toast.error("Failed to load users"); return; }

    // Fetch emails via secure admin function
    const userIds = (data || []).map((u: any) => u.user_id);
    if (userIds.length > 0) {
      const { data: emailData } = await supabase.rpc("get_user_emails", {
        user_ids: userIds,
      } as any);
      const emailMap = new Map((emailData || []).map((e: any) => [e.user_id, e.email]));
      setUsers((data || []).map((u: any) => ({ ...u, email: emailMap.get(u.user_id) || "Unknown" })));
    } else {
      setUsers(data || []);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("user_approvals")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`User ${status}`);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status } : u));
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-body">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl text-primary">User Management</h1>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signed Up</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground font-body py-8">
                  No users yet
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs max-w-[200px] truncate">
                    {user.user_id}
                  </TableCell>
                  <TableCell>{statusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-body">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.status === "pending" && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => updateStatus(user.id, "approved")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-body rounded-md hover:bg-green-500/30 transition-colors"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(user.id, "rejected")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive text-xs font-body rounded-md hover:bg-destructive/20 transition-colors"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                    {user.status !== "pending" && (
                      <button
                        onClick={() => updateStatus(user.id, "pending")}
                        className="px-3 py-1.5 bg-secondary text-muted-foreground text-xs font-body rounded-md hover:text-foreground transition-colors"
                      >
                        Reset to Pending
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
