import { Skeleton } from "@/components/ui/skeleton";

export function PerformanceAreaSkeleton() {
  return (
    <div className="m-3 flex w-full flex-col items-center">
      <Skeleton className="h-[350px] w-full rounded-xl" />
    </div>
  );
}
