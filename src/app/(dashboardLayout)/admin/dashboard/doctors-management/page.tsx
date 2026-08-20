
import DoctorsManagementHeader from "@/components/modules/Admin/DoctorsManagement.tsx/DoctorsManagementHeader";
import DoctorsTable from "@/components/modules/Admin/DoctorsManagement.tsx/DoctorsTable";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { getDoctors } from "@/services/admin/doctorManagement";
import { getSpecialties } from "@/services/admin/specialtiesManagement";
import { ISpecialty } from "@/types/specialties.interface"
import { Suspense } from "react";

const AdminDoctorsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const specialtiesResult = await getSpecialties();
  const doctorsResult = await getDoctors();
  return (
    <div className="space-y-6">
      <DoctorsManagementHeader specialties={specialtiesResult.data} />
      <div className="flex space-x-2">
        <SearchFilter paramName="searchTerm" placeholder="Search doctors..." />
        <SelectFilter
          paramName="specialty" // ?specialty="Cardiology"
          options={specialtiesResult?.data.map((specialty: ISpecialty) => ({
            label: specialty.title,
            value: specialty.title,
          }))}
          placeholder="Filter by specialty"
        />
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <DoctorsTable
          doctors={doctorsResult.data}
          specialties={specialtiesResult.data}
        />
        {/* <TablePagination
          currentPage={doctorsResult.meta.page}
          totalPages={totalPages}
        /> */}
      </Suspense>
    </div>
  );
};

export default AdminDoctorsManagementPage;