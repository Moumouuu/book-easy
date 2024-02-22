import { Skeleton } from "@/components/ui/skeleton";

export function PerformanceKpiSkeleton({
  numberOfCards = 3,
}: {
  numberOfCards?: number;
}) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="my-1 flex w-full flex-col items-center lg:flex-row">
        {[...Array(numberOfCards)].map((index: number) => (
          <Skeleton
            key={index}
            className="m-4 h-[125px] w-full rounded-xl lg:w-1/3"
          />
        ))}
      </div>
    </div>
  );
}
