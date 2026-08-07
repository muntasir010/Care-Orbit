import { getUserInfo } from "@/services/auth/getUserInfo";
import DashboardNavbarContent from "./DashboardNavbarContent";
import { UserInfo } from "@/types/user.interface";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getDefaultDashboardRoute } from "@/lib/auth-utils";

const DashboardNavbar = async () => {
  const userInfo = (await getUserInfo()) as UserInfo;
  const navItems = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);
  return (
    <div>
      <DashboardNavbarContent
        userInfo={userInfo}
        navItems={navItems}
        dashboardHome={dashboardHome}
      />
    </div>
  );
};

export default DashboardNavbar;
