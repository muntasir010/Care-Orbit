"use client";

import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import ManagementTable from "@/components/shared/ManagementTable";
import { deleteSpecialty } from "@/services/admin/specialtiesManagement";
import { ISpecialty } from "@/types/specialties.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { specialtiesColumns } from "./specialtiesColumns";

interface SpecialtyTableProps {
  specialties: ISpecialty[];
}

const SpecialtiesTable = ({ specialties }: SpecialtyTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingSpecialty, setDeletingSpecialty] =
    useState<ISpecialty | null>(null);
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (specialty: ISpecialty) => {
    setDeletingSpecialty(specialty);
  };

  const confirmDelete = async () => {
    if (!deletingSpecialty) return;

    setIsDeletingDialog(true);
    const result = await deleteSpecialty(deletingSpecialty.id);
    setIsDeletingDialog(false);
    if (result.success) {
      toast.success(result.message || "Specialty deleted successfully");
      setDeletingSpecialty(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete specialty");
    }
  };

  return (
    <>
      <ManagementTable
        data={specialties}
        columns={specialtiesColumns}
        onDelete={handleDelete}
        getRowKey={(specialty) => specialty.id}
        emptyMessage="No specialties found"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingSpecialty}
        onOpenChange={(open) => !open && setDeletingSpecialty(null)}
        onConfirm={confirmDelete}
        title="Delete Specialty"
        description={`Are you sure you want to delete ${deletingSpecialty?.title}? This action cannot be undone.`}
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default SpecialtiesTable;
