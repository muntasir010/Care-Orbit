import Link from "next/link";
import { getCookie } from "@/services/auth/tokenHandler";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import AISearchDialog from "./AISearchDialog";
import NavbarAuthButtons from "./NavbarAuthButton";
import MobileMenu from "./MobileMenu";
import { ShoppingCart } from "lucide-react";

const PublicNavbar = async () => {
  const navItems = [
    { href: "/consultation", label: "Consultation" },
    { href: "/medicines", label: "Medicine" },
    { href: "#", label: "Health Plans" },
    { href: "#", label: "Diagnostics" },
    { href: "#", label: "NGOs" },
  ];

  const accessToken = await getCookie("accessToken");
  const userInfo = accessToken ? await getUserInfo() : null;
  const dashboardRoute = userInfo
    ? getDefaultDashboardRoute(userInfo.role)
    : "/";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl lg:text-2xl font-bold text-primary ">
            Care Orbit
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/medicines/cart"
            title="Cart"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ShoppingCart />
          </Link>
          <AISearchDialog />
          <NavbarAuthButtons
            initialHasToken={!!accessToken}
            initialUserInfo={userInfo}
            initialDashboardRoute={dashboardRoute}
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          navItems={navItems}
          hasAccessToken={!!accessToken}
          userInfo={userInfo}
          dashboardRoute={dashboardRoute}
        />
      </div>
    </header>
  );
};

export default PublicNavbar;
