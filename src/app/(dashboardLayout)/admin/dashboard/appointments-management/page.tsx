import ManagementPageHeader from "@/components/shared/ManagementPageHeader";

const AppointmentsManagementPage = async () => {

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title="Appointments Management"
        description="View and manage all appointments"
      />
    </div>
  );
};

export default AppointmentsManagementPage;