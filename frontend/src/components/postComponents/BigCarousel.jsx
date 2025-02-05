import { useEffect, useRef } from "react";
import { GrNext } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";

export default function BigCarousel({ dialogRef, images, imgIdx, setImgIdx }) {
  const leftButtonRef = useRef(null),
    rightButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "ArrowLeft") leftButtonRef.current?.click();
      if (event.code === "ArrowRight") rightButtonRef.current?.click();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="max-w-[100vw] bg-transparent outline-none"
    >
      <div className="flex max-w-fit items-center justify-center bg-black bg-opacity-50">
        {images.length > 1 && (
          <button
            ref={leftButtonRef}
            onClick={() =>
              setImgIdx((prev) => (prev ? prev - 1 : images.length - 1))
            }
            className="flex w-[7vw] rotate-180 cursor-pointer justify-center text-white"
          >
            <GrNext size={52} />
          </button>
        )}
        <div className="relative">
          <RxCross2
            onClick={() => dialogRef.current.close()}
            className="absolute right-2 top-2 z-10 size-5 cursor-pointer rounded-full border border-white bg-black bg-opacity-50 p-1 text-white md:size-7"
          />
          <img src={images[imgIdx]} className="max-h-[90vh] max-w-[80vw]" />
          {images.length > 1 && (
            <span className="absolute bottom-0 left-[50%] mb-2 -translate-x-1/2 select-none rounded-lg border border-white bg-black px-2 py-1 text-white opacity-75">
              {imgIdx + 1} / {images.length}
            </span>
          )}
        </div>
        {images.length > 1 && (
          <button
            ref={rightButtonRef}
            onClick={() => setImgIdx((prev) => (prev + 1) % images.length)}
            className="flex w-[7vw] cursor-pointer justify-center text-white"
          >
            <GrNext size={52} />
          </button>
        )}
      </div>
    </dialog>
  );
}
