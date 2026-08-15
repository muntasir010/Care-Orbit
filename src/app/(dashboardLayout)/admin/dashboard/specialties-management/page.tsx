import SpecialtiesManagementHeader from "@/components/modules/Admin/SpecialtiesManagement/SpecialtiesManagementHeader";
import RefreshButton from "@/components/shared/RefreshButton";
import { getSpecialties } from "@/services/admin/specialtiesManagement";

const AdminSpecialtiesManagementPage = async () => {
 const result = await getSpecialties();
  return (
    <div className="space-y-6">
      <SpecialtiesManagementHeader />
      <div className="flex">
        <RefreshButton />
      </div>
    </div>
  );
};

export default AdminSpecialtiesManagementPage;