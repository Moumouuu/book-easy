import { Skeleton } from "@/components/ui/skeleton";

export function PerformanceSkeleton({
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
      <Skeleton className="mx-4 h-[300px] w-1/2 rounded-xl" />
    </div>
  );
}
