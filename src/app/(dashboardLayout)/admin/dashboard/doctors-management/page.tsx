import DoctorFilters from "@/components/modules/Admin/DoctorsManagement.tsx/DoctorFilters";
import DoctorsManagementHeader from "@/components/modules/Admin/DoctorsManagement.tsx/DoctorsManagementHeader";
import DoctorsTable from "@/components/modules/Admin/DoctorsManagement.tsx/DoctorsTable";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getDoctors } from "@/services/admin/doctorManagement";
import { getSpecialties } from "@/services/admin/specialtiesManagement";
import { Suspense } from "react";

const AdminDoctorsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const specialtiesResult = await getSpecialties();
  const doctorsResult = await getDoctors(queryString);

  const totalPages = Math.ceil(
    (doctorsResult?.meta?.total || 1) / (doctorsResult?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <DoctorsManagementHeader specialties={specialtiesResult?.data || []} />
      <DoctorFilters specialties={specialtiesResult?.data || []} />
      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <DoctorsTable
          doctors={doctorsResult?.data || []}
          specialties={specialtiesResult?.data || []}
        />
        <TablePagination
          currentPage={doctorsResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default AdminDoctorsManagementPage;
