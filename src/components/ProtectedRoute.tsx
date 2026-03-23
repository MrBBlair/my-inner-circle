import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({
  children,
  requireOnboarding,
}: {
  children: ReactNode;
  requireOnboarding?: boolean;
}) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (requireOnboarding && !user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
