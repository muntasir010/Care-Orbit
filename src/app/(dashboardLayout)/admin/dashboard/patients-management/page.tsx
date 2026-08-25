import PatientsTable from "@/components/modules/Admin/PatientsManagement/PatientsTable";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getPatients } from "@/services/admin/patientsManagement";
import { Suspense } from "react";

const PatientsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const patientsResult = await getPatients(queryString);
  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title="Patients Management"
        description="Manage patients information and details"
      />

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <PatientsTable patients={patientsResult?.data || []} />
      </Suspense>
    </div>
  );
};

export default PatientsManagementPage;
