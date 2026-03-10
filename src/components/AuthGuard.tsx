import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

type GuardStatus = "loading" | "approved" | "pending" | "rejected" | "unauthenticated";

const AuthGuard = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const [status, setStatus] = useState<GuardStatus>("loading");
  const navigate = useNavigate();

  const verifyAccess = useCallback(async (session: Session | null) => {
    if (!session) {
      navigate("/admin/login", { replace: true });
      return;
    }

    if (requireAdmin) {
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (!isAdmin) {
        setStatus("rejected");
        return;
      }
    }

    const { data: approval } = await supabase
      .from("user_approvals")
      .select("status")
      .eq("user_id", session.user.id)
      .single();

    if (!approval) {
      setStatus("pending");
    } else {
      setStatus(approval.status as GuardStatus);
    }
  }, [navigate, requireAdmin]);

  useEffect(() => {
    // Set up auth listener FIRST so we catch OAuth token exchange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        verifyAccess(session);
      } else if (event === "SIGNED_OUT") {
        navigate("/admin/login", { replace: true });
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyAccess(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, requireAdmin, verifyAccess]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-body">Loading…</div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="glass-card p-8 max-w-sm text-center space-y-4">
          <h2 className="text-xl font-display text-foreground">Account Pending</h2>
          <p className="text-sm text-muted-foreground font-body">
            Your account is awaiting administrator approval. You'll be able to access this page once approved.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="glass-card p-8 max-w-sm text-center space-y-4">
          <h2 className="text-xl font-display text-destructive">Access Denied</h2>
          <p className="text-sm text-muted-foreground font-body">
            Your account request has been declined.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return status === "approved" ? <>{children}</> : null;
};

export default AuthGuard;
