import { useEffect, useRef } from "react";
import { GrNext } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { MdOutlinePlayCircle } from "react-icons/md";

export default function BigCarousel({
  dialogRef,
  files,
  fileIdx,
  setFileIdx,
  videoRefs,
  isPost = false,
}) {
  const leftButtonRef = useRef(null),
    rightButtonRef = useRef(null);

  useEffect(() => {
    // const dialogRefCopy = dialogRef;
    const handleKeyDown = (event) => {
      if (event.code === "ArrowLeft") leftButtonRef.current?.click();
      if (event.code === "ArrowRight") rightButtonRef.current?.click();
    };
    // window.addEventListener("keydown", handleKeyDown);
    // dialogRef.current.addEventListener("close", () => {
    //   videoRefs.current?.forEach((video) => video.pause());
    // });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogRef, videoRefs]);

  function type() {
    if (files[fileIdx]?.media.type.startsWith("image")) return "image";
    if (files[fileIdx]?.media.type.startsWith("video")) return "video";
    return "";
  }

  return (
    <dialog
      ref={dialogRef}
      // onEx
      className="max-w-[100vw] bg-transparent outline-none"
    >
      <div className="flex max-w-fit items-center justify-center bg-black bg-opacity-50">
        {files.length > 1 && (
          <button
            ref={leftButtonRef}
            onClick={() =>
              setFileIdx((prev) => (prev ? prev - 1 : files.length - 1))
            }
            className="flex w-[7vw] rotate-180 cursor-pointer justify-center text-white"
          >
            <GrNext size={52} />
          </button>
        )}
        <div className="relative flex items-center justify-center">
          <RxCross2
            size={30}
            onClick={() => dialogRef.current.close()}
            className="absolute right-2 top-2 z-10 size-5 cursor-pointer rounded-full border border-white bg-black bg-opacity-50 p-1 text-white md:size-7"
          />
          {type(files[fileIdx]) === "image" ? (
            <img src={files[fileIdx].url} />
          ) : type(files[fileIdx]) === "video" ? (
            isPost ? (
              <div className="relative">
                <MdOutlinePlayCircle
                  size={100}
                  onClick={() => {
                    videoRefs.current[fileIdx].requestFullscreen();
                    videoRefs.current[fileIdx].play();
                  }}
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white"
                />
                <img src={files[fileIdx].media.thumbnail} />
              </div>
            ) : (
              videoRefs[fileIdx]
            )
          ) : null}
          {files.length > 1 && (
            <span className="absolute bottom-0 left-[50%] mb-2 -translate-x-1/2 select-none rounded-lg border border-white bg-black px-2 py-1 text-white opacity-75">
              {fileIdx + 1} / {files.length}
            </span>
          )}
        </div>
        {files.length > 1 && (
          <button
            ref={rightButtonRef}
            onClick={() => setFileIdx((prev) => (prev + 1) % files.length)}
            className="flex w-[7vw] cursor-pointer justify-center text-white"
          >
            <GrNext size={52} />
          </button>
        )}
      </div>
    </dialog>
  );
}
