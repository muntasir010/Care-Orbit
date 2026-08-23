import AdminsManagementHeader from "@/components/modules/Admin/AdminManagement/AdminsManagementHeader";
import AdminsTable from "@/components/modules/Admin/AdminManagement/AdminsTable";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getAdmins } from "@/services/admin/adminsManagement";
import { Suspense } from "react";

const AdminAdminsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const adminsResult = await getAdmins(queryString);

  return (
    <div>
      <AdminsManagementHeader />

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <AdminsTable admins={adminsResult?.data || []} />
      </Suspense>
    </div>
  );
};

export default AdminAdminsManagementPage;
