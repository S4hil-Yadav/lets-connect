import { Skeleton } from "../ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="flex w-full flex-col border-t-2 border-gray-300 px-3 pb-10 pt-4 first:border-t-0">
      <div className="flex w-full items-center gap-3 border-b border-gray-200 pb-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-5 py-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-60 w-full" />
        </div>
        {/* <Skeleton className="flex w-full justify-center" /> image */}
      </div>
      {/* <Skeleton className="h-14 w-full" /> comment-input*/}
    </div>
  );
}
