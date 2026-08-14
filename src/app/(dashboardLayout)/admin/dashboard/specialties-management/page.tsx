import RefreshButton from "@/components/shared/RefreshButton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { getSpecialties } from "@/services/admin/specialtiesManagement";
import { Suspense } from "react";

const AdminSpecialtiesManagementPage = async () => {
  const result = await getSpecialties();
  return (
    <div className="space-y-6">
      <div className="flex">
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
      </Suspense>
    </div>
  );
};

export default AdminSpecialtiesManagementPage;