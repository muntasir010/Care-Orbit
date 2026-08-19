import DoctorsManagementHeader from "@/components/modules/Admin/DoctorsManagement.tsx/DoctorsManagementHeader";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { getSpecialties } from "@/services/admin/specialtiesManagement";
import { ISpecialty } from "@/types/specialties.interface";

const AdminDoctorsManagementPage = async ({}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const specialtiesResult = await getSpecialties();
  return (
    <div className="space-y-6">
      <DoctorsManagementHeader specialties={specialtiesResult.data} />
      <div className="flex space-x-2">
        <SearchFilter paramName="searchTerm" placeholder="Search doctors..." />
        <SelectFilter
          paramName="specialty" // ?specialty="Cardiology"
          options={specialtiesResult.data.map((specialty: ISpecialty) => ({
            label: specialty.title,
            value: specialty.title,
          }))}
          placeholder="Filter by specialty"
        />
        <RefreshButton />
      </div>
    </div>
  );
};

export default AdminDoctorsManagementPage;
