import { Skeleton } from "../ui/skeleton";

export default function UserCardSkeleton({ count = 3 }) {
  return (
    <ul className="my-2 flex flex-col gap-5">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-gray-300 px-3">
          <Skeleton className="size-12 rounded-full bg-gray-300" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-32 bg-gray-300" />
            <Skeleton className="h-3 w-20 bg-gray-300" />
          </div>
          <Skeleton className="h-8 w-20 bg-gray-300" />
        </div>
      ))}
    </ul>
  );
}
