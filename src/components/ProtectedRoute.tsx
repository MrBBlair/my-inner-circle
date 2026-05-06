import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { hasApprovedMembership } from "../lib/storage";

export function ProtectedRoute({
  children,
  requireOnboarding,
  requireSiteAdmin,
}: {
  children: ReactNode;
  requireOnboarding?: boolean;
  requireSiteAdmin?: boolean;
}) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (!hasApprovedMembership(user)) {
    return <Navigate to="/account-status" replace />;
  }

  if (requireOnboarding && !user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (requireSiteAdmin && user.isSiteAdmin !== true) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
