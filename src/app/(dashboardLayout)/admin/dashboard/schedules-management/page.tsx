const AdminSchedulesManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {

  return (
    <div className="space-y-6">
      <h1>Schedules Management</h1>
    </div>
  );
};

export default AdminSchedulesManagementPage;