import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TextWithExpand from "../TextWithExpand";
import { useRef, useState } from "react";
import BigCarousel from "./BigCarousel";

export default function PostBody({ post }) {
  const imgDialogRef = useRef(null);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-1 text-wrap break-words pb-5 pt-3 text-justify">
        <span className="text-lg font-semibold">{post.title}</span>
        <TextWithExpand originalText={post.body} minHeight={4.5} />
      </div>
      <BigCarousel
        dialogRef={imgDialogRef}
        images={post.images}
        imgIdx={imgIdx}
        setImgIdx={setImgIdx}
      />

      <Carousel className="flex w-full justify-center">
        <CarouselContent>
          {post.video ? (
            <video controls className="max-h-96">
              <source src={post.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            post.images.map((image, i) => (
              <CarouselItem key={i}>
                <img
                  src={image}
                  loading="lazy"
                  onClick={() => {
                    setImgIdx(i);
                    imgDialogRef.current.showModal();
                  }}
                  className="mx-auto aspect-square h-60 w-full select-none border-2 border-gray-200 object-cover md:aspect-[4/3]"
                />
              </CarouselItem>
            ))
          )}
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
