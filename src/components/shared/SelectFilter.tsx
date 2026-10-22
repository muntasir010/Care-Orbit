"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SelectFilterProps {
  paramName: string; 
  placeholder?: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
}

const SelectFilterContent = ({
  paramName,
  placeholder,
  options,
  defaultValue = "All",
}: SelectFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentValue = searchParams.get(paramName) || defaultValue;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === defaultValue) {
      params.delete(paramName);
    } else if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };
  return (
    <Select
      value={currentValue}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default function SelectFilter(props: SelectFilterProps) {
  return (
    <Suspense
      fallback={
        <div className="h-12 animate-pulse rounded-md bg-muted" />
      }
    >
      <SelectFilterContent {...props} />
    </Suspense>
  );
}
