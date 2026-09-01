"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const SchedulesManagementHeader = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //force remount to reset state of form
  const [dialogKey, setDialogKey] = useState(0);

  const handleOpenDialog = () => {
    setDialogKey((prev) => prev + 1); // Force remount
    setIsDialogOpen(true);
  };

  return (
    <>
      <ManagementPageHeader
        title="Schedules Management"
        description="Create and manage appointment schedules"
        action={{
          label: "Create Schedule",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default SchedulesManagementHeader;