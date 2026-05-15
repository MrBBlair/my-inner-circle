import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { ScrollToTop } from "./components/ScrollToTop";
import { BottomNav } from "./components/BottomNav";
import { LegalStrip } from "./components/LegalStrip";
import { MarketingLayout } from "./components/MarketingLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SidebarAnnouncements } from "./components/SidebarAnnouncements";
import { CommunityGuidelines } from "./pages/CommunityGuidelines";
import { CrownBlogArticlePage } from "./pages/CrownBlogArticlePage";
import { CrownHubPage } from "./pages/CrownHubPage";
import { CommunityHubPage } from "./pages/CommunityHubPage";
import { DirectoryPage } from "./pages/DirectoryPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { EventsPage } from "./pages/EventsPage";
import { GivePage } from "./pages/GivePage";
import { ForumCategoryPage } from "./pages/ForumCategory";
import { ForumHome } from "./pages/ForumHome";
import { HomeFeed } from "./pages/HomeFeed";
import { Login } from "./pages/Login";
import { ModerationPage } from "./pages/ModerationPage";
import { NeighborhoodGroupForumPage } from "./pages/NeighborhoodGroupForumPage";
import { Onboarding } from "./pages/Onboarding";
import { PitchDeckRedirect } from "./pages/PitchDeckRedirect";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ProfilePage } from "./pages/ProfilePage";
import { PublicContact } from "./pages/PublicContact";
import { ResourceArticlePage } from "./pages/ResourceArticlePage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { Signup } from "./pages/Signup";
import { SignupThanks } from "./pages/SignupThanks";
import { AccountStatus } from "./pages/AccountStatus";
import { SharedProfilePage } from "./pages/SharedProfilePage";
import { SiteAdminDashboard } from "./pages/SiteAdminDashboard";
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
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/pitchdeck" element={<PitchDeckRedirect />} />
      <Route path="/pitchdeck/" element={<PitchDeckRedirect />} />
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/thanks" element={<SignupThanks />} />
        <Route path="/account-status" element={<AccountStatus />} />
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
        <Route path="/crown" element={<CrownHubPage />} />
        <Route path="/crown/blog/:slug" element={<CrownBlogArticlePage />} />
        <Route path="/crown/guide/*" element={<Navigate to="/crown" replace />} />
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
          path="/forum/group/:slug"
          element={
            <ProtectedRoute requireOnboarding>
              <NeighborhoodGroupForumPage />
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
          path="/events/:eventId"
          element={
            <ProtectedRoute requireOnboarding>
              <EventDetailPage />
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
          path="/resources/:slug"
          element={
            <ProtectedRoute requireOnboarding>
              <ResourceArticlePage />
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
          path="/members/:userId"
          element={
            <ProtectedRoute requireOnboarding>
              <SharedProfilePage />
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
          path="/admin"
          element={
            <ProtectedRoute requireOnboarding requireSiteAdmin>
              <SiteAdminDashboard />
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
    </>
  );
}
