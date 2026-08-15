import SpecialtiesManagementHeader from "@/components/modules/Admin/SpecialtiesManagement/SpecialtiesManagementHeader";
import SpecialtiesTable from "@/components/modules/Admin/SpecialtiesManagement/SpecialtiesTable";
import RefreshButton from "@/components/shared/RefreshButton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { getSpecialties } from "@/services/admin/specialtiesManagement";
import { Suspense } from "react";

const AdminSpecialtiesManagementPage = async () => {
  const result = await getSpecialties();
  return (
    <div className="space-y-6">
      <SpecialtiesManagementHeader />
      <div className="flex">
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
        <SpecialtiesTable specialties={result.data} />
      </Suspense>
    </div>
  );
};

export default AdminSpecialtiesManagementPage;
