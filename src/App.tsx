import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { BottomNav } from "./components/BottomNav";
import { LegalStrip } from "./components/LegalStrip";
import { MarketingLayout } from "./components/MarketingLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SidebarAnnouncements } from "./components/SidebarAnnouncements";
import { CommunityGuidelines } from "./pages/CommunityGuidelines";
import { CommunityHubPage } from "./pages/CommunityHubPage";
import { DirectoryPage } from "./pages/DirectoryPage";
import { EventsPage } from "./pages/EventsPage";
import { GivePage } from "./pages/GivePage";
import { ForumCategoryPage } from "./pages/ForumCategory";
import { ForumHome } from "./pages/ForumHome";
import { HomeFeed } from "./pages/HomeFeed";
import { Login } from "./pages/Login";
import { ModerationPage } from "./pages/ModerationPage";
import { Onboarding } from "./pages/Onboarding";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ProfilePage } from "./pages/ProfilePage";
import { PublicContact } from "./pages/PublicContact";
import { ResourcesPage } from "./pages/ResourcesPage";
import { Signup } from "./pages/Signup";
import { SupportPage } from "./pages/SupportPage";
import { TermsOfService } from "./pages/TermsOfService";
import { ThreadPage } from "./pages/ThreadPage";
import { VendorsPage } from "./pages/VendorsPage";
import { Welcome } from "./pages/Welcome";
import { WellnessPage } from "./pages/WellnessPage";

function AppLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <div>
          <Outlet />
        </div>
        <SidebarAnnouncements />
      </main>
      <LegalStrip />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/guidelines" element={<CommunityGuidelines />} />
        <Route path="/contact" element={<PublicContact />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route
          path="/app"
          element={
            <ProtectedRoute requireOnboarding>
              <HomeFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute requireOnboarding>
              <ForumHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/:slug"
          element={
            <ProtectedRoute requireOnboarding>
              <ForumCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/:slug/:threadId"
          element={
            <ProtectedRoute requireOnboarding>
              <ThreadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute requireOnboarding>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wellness"
          element={
            <ProtectedRoute requireOnboarding>
              <WellnessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute requireOnboarding>
              <ResourcesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute requireOnboarding>
              <CommunityHubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/give"
          element={
            <ProtectedRoute requireOnboarding>
              <GivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/directory"
          element={
            <ProtectedRoute requireOnboarding>
              <DirectoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoute requireOnboarding>
              <VendorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireOnboarding>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute requireOnboarding>
              <SupportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderation"
          element={
            <ProtectedRoute requireOnboarding>
              <ModerationPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
