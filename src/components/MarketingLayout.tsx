import { Outlet } from "react-router-dom";
import { FloatingBrandLayer } from "./FloatingBrandLayer";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function MarketingLayout() {
  return (
    <div className="marketing-shell">
      <FloatingBrandLayer />
      <SiteHeader />
      <div className="marketing-shell__content">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
