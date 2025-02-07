import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TextWithExpand from "../TextWithExpand";
import { useEffect, useRef, useState } from "react";
import BigCarousel from "./BigCarousel";

export default function PostBody({ post }) {
  const videoRefs = useRef([]);
  const imgDialogRef = useRef(null);
  const [fileidx, setFileIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          videoRefs.current.forEach(
            (videoRef) => !entry.isIntersecting && videoRef.pause(),
          ),
        );
      },
      { threshold: 0.1 },
    );

    videoRefs.current.forEach((videoRef) => observer.observe(videoRef));

    return () =>
      videoRefs.current.forEach((videoRef) => observer.unobserve(videoRef));
  }, []);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-1 text-wrap break-words pb-5 pt-3 text-justify">
        <span className="text-lg font-semibold">{post.title}</span>
        <TextWithExpand originalText={post.body} minHeight={4.5} />
      </div>
      <BigCarousel
        dialogRef={imgDialogRef}
        files={post.media}
        fileIdx={fileidx}
        setFileIdx={setFileIdx}
        videoRefs={videoRefs}
        isPost={true}
      />

      <Carousel className="flex w-full justify-center">
        <CarouselContent>
          {post.media.map((file, i) => (
            <CarouselItem key={i} className="flex items-center justify-center">
              {file.media.type === "image" ? (
                <img
                  src={file.url}
                  loading="lazy"
                  onClick={() => {
                    setFileIdx(i);
                    imgDialogRef.current.showModal();
                  }}
                  className="mx-auto aspect-[3/4] max-h-60 w-full select-none rounded-lg border-2 border-gray-200 object-cover md:aspect-[4/3]"
                />
              ) : file.media.type === "video" ? (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  controls
                  poster={file.media.thumbnail}
                  preload="none"
                  onClick={(e) => {
                    e.target.requestFullscreen();
                    e.target.play();
                  }}
                  className="max-h-60"
                >
                  <source src={file.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </CarouselItem>
          ))}
        </CarouselContent>
        {post.media.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-3 border-black hover:bg-gray-300" />
            <CarouselNext className="absolute right-3 border-black hover:bg-gray-300" />
          </>
        )}
      </Carousel>
    </div>
  );
}
