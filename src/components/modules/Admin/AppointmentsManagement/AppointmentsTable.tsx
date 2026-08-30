"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { IAppointment } from "@/types/appointment.interface";
import { appointmentsColumns } from "./appointementColumns";

interface AppointmentsTableProps {
  appointments: IAppointment[];
}

const AppointmentsTable = ({ appointments }: AppointmentsTableProps) => {
  


  return (
    <>
      <ManagementTable
        data={appointments}
        columns={appointmentsColumns}
        getRowKey={(appointment) => appointment.id!}
        emptyMessage="No appointments found"
      />
    </>
  );
};

export default AppointmentsTable;