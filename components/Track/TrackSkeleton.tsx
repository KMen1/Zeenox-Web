import { Skeleton } from "../ui/skeleton";

export function TrackSkeleton() {
  return (
    <div className="flex items-center justify-between p-1.5">
      <div className="flex items-center gap-2">
        <Skeleton className="min-h-[36px] min-w-[36px] rounded-md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[12px] w-[100px]" />
          <Skeleton className="h-[12px] w-[60px]" />
        </div>
      </div>

      <Skeleton className="h-[12px] w-[40px]" />
    </div>
  );
}
