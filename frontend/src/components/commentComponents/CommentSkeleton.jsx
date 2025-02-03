import { Skeleton } from "../ui/skeleton";

export default function CommentSkeleton({ count = 0 }) {
  return (
    <ul className="flex flex-col gap-5">
      {[...Array(count)].map((_, i) => (
        <li
          key={i}
          className="flex gap-2 border-b-2 pb-3 last:mb-5 last:border-b-0"
        >
          <Skeleton className="size-11 rounded-full" />
          <div className="flex flex-col gap-2 pr-7">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-12 min-w-64" />
          </div>
        </li>
      ))}
    </ul>
  );
}
