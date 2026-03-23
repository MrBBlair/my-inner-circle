import { Outlet } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function MarketingLayout() {
  return (
    <div className="marketing-shell">
      <SiteHeader />
      <div className="marketing-shell__content">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
