"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

const LoginSuccessToastContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("loggedIn") === "true") {
      toast.success("You have been logged in successfully.");

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("loggedIn");
      router.replace(newUrl.toString());
    }
  }, [searchParams, router]);
  return null;
};

export default function LoginSuccessToast() {
  return (
    <Suspense
      fallback={
        <div className="h-10 animate-pulse rounded-md bg-muted" />
      }
    >
      <LoginSuccessToastContent />
    </Suspense>
  );
}