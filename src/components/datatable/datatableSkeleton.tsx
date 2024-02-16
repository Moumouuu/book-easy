import { Skeleton } from "@/components/ui/skeleton";

export default function DatatableSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col p-10">
      <div className="mb-4 flex w-full justify-between">
        <Skeleton className="h-12 w-[200px] rounded" />
        <Skeleton className="h-12 w-[200px] rounded" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-[600px] w-full rounded" />
      </div>
    </div>
  );
}
