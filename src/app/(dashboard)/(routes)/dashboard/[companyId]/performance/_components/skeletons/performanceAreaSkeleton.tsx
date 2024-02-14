import { Skeleton } from "@/components/ui/skeleton";

export function PerformanceAreaSkeleton() {
  return (
    <div className="flex w-full flex-col items-center">
      <Skeleton className="h-[250px] w-1/2 rounded-xl" />
    </div>
  );
}
