import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TextWithExpand from "../TextWithExpand";

export default function PostBody({ post }) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-1 text-wrap break-words pb-5 pt-3 text-justify">
        <span className="text-lg font-bold">{post.title}</span>
        <TextWithExpand originalText={post.body} minLen={300} />
      </div>
      <Carousel className="flex w-full justify-center">
        <CarouselContent>
          {post.images?.map((image, i) => (
            <CarouselItem key={i} className="max-h-xs max-w-xs">
              <img
                src={image}
                className="border-2 border-gray-200 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {post.images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-3 border-black hover:bg-gray-300" />
            <CarouselNext className="absolute right-3 border-black hover:bg-gray-300" />
          </>
        )}
      </Carousel>
    </div>
  );
}
