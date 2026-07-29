import LogoutButton from "@/components/shared/LogoutButton";
import React from "react";

const CommonDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl text-primary">Dashboard</h1>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
};

export default CommonDashboardLayout;
