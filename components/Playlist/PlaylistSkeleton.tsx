import { Skeleton } from "../ui/skeleton";

export function PlaylistSkeleton() {
  return (
    <div className="flex w-full flex-row gap-2 p-1.5">
      <Skeleton className="min-h-[40px] min-w-[40px] rounded-md" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[12px] w-[100px]" />
        <Skeleton className="h-[12px] w-[60px]" />
      </div>
    </div>
  );
}
