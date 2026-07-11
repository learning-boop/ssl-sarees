import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, isLoading, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setLocation("/login");
    } else if (adminOnly && !isAdmin) {
      setLocation("/");
    }
  }, [isLoading, user, isAdmin, adminOnly, setLocation]);

  if (isLoading || !user || (adminOnly && !isAdmin)) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex items-center justify-center">
        <p className="text-muted-foreground font-poppins text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
