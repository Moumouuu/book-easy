import { Skeleton } from "@/components/ui/skeleton";

export function PerformanceKpiSkeleton({
  numberOfCards = 3,
}: {
  numberOfCards?: number;
}) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="my-1 flex w-full items-center">
        {[...Array(numberOfCards)].map((index: number) => (
          <Skeleton key={index} className="mx-4 h-[125px] w-1/3 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
