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

export default function PostBody({ post, isModal }) {
  const imgDialogRef = useRef(null);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-1 text-wrap break-words pb-5 pt-3 text-justify">
        <span className="text-lg font-bold">{post.title}</span>
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
          {post.images.map((image, i) => (
            <CarouselItem key={i} className="max-w-xs">
              <img
                src={image}
                onClick={() => {
                  setImgIdx(i);
                  imgDialogRef.current.showModal();
                }}
                className={`select-none border-2 border-gray-200 ${!isModal && "max-h-40"}`}
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
