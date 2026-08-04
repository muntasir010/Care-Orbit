import { getUserInfo } from "@/services/auth/getUserInfo";
import DashboardNavbarContent from "./DashboardNavbarContent";
import { UserInfo } from "@/types/user.interface";

const DashboardNavbar = async () => {
  const userInfo = (await getUserInfo()) as UserInfo;
  return (
    <div>
      <DashboardNavbarContent userInfo={userInfo} />
    </div>
  );
};

export default DashboardNavbar;
