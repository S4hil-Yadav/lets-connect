import { Skeleton } from "../ui/skeleton";

export default function FollowRequestSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 border-t-2 border-gray-300 px-3 pb-10 pt-4 first:border-t-0 md:max-w-lg">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="size-10 rounded-full" />
      </div>
    </div>
  );
}
