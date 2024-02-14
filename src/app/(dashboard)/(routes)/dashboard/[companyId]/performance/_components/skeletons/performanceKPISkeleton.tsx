import { Skeleton } from "@/components/ui/skeleton";

export function PerformanceKpiSkeleton({
  numberOfCards = 3,
}: {
  numberOfCards?: number;
}) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="my-10 flex w-full items-center">
        {[...Array(numberOfCards)].map(() => (
          <Skeleton className="mx-4 h-[125px] w-1/3 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
