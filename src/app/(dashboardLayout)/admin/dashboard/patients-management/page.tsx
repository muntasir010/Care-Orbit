import PatientsTable from "@/components/modules/Admin/PatientsManagement/PatientsTable"
import ManagementPageHeader from "@/components/shared/ManagementPageHeader"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { getPatients } from "@/services/admin/patientsManagement"
import { Suspense } from "react"

const PatientsManagementPage = async() => {

    const patientsResult = await getPatients();
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
  )
}

export default PatientsManagementPage