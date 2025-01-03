import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function PostBody({ title, body, images }) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-1 text-wrap break-words py-3 text-justify">
        <span className="text-lg font-bold">{title}</span>
        <span className="text-sm">{body}</span>
      </div>
      <Carousel className="mx-auto w-full pt-2">
        <CarouselContent>
          {images?.map((image, i) => (
            <CarouselItem key={i} className="max-h-xs max-w-xs">
              {image ? (
                <img
                  src={image}
                  className="mx-auto border-2 border-gray-200 object-contain"
                />
              ) : (
                <Skeleton className="h-20 w-full rounded-none" />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {images?.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-3 border-black hover:bg-gray-300" />
            <CarouselNext className="absolute right-3 border-black hover:bg-gray-300" />
          </>
        )}
      </Carousel>
    </div>
  );
}
