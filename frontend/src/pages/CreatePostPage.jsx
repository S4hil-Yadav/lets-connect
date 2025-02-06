import toast from "react-hot-toast";
import { FiMinusCircle } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { useCreatePostMutation } from "@/lib/mutations/post.mutations";
import { useDispatch, useSelector } from "react-redux";
import {
  setDraft,
  clearDraft,
  setPosting,
  clearPosting,
} from "@/redux/draft/draftSlice";
import BigCarousel from "@/components/postComponents/BigCarousel";
import { useRef, useState } from "react";
import { MdOutlineVideoLibrary } from "react-icons/md";

export default function CreatePostPage() {
  const dispatch = useDispatch(),
    { draft, posting } = useSelector((state) => state.draft);

  const dialogRef = useRef(null);

  const [fileIdx, setFileIdx] = useState(0),
    [files, setFiles] = useState([]);

  const { mutateAsync: createPost } = useCreatePostMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!draft.title.trim() && !draft.body.trim() && !files.length)
        throw new Error("Post can't be empty");

      const formData = new FormData();
      formData.append("post", JSON.stringify(draft));
      files.forEach((file) => formData.append("files", file.media));

      dispatch(setPosting());

      await createPost(formData);

      dispatch(clearDraft());
      setFiles([]);
    } catch (error) {
      toast.error(error.message);
      dispatch(clearPosting());
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-10 bg-gray-100 p-5">
      <span className="text-center text-4xl font-bold text-gray-700">
        Create Post
      </span>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-8">
        <TitleInput draft={draft} disabled={posting} />
        <BodyInput draft={draft} disabled={posting} />
        <MediaInput
          draft={draft}
          setFileIdx={setFileIdx}
          dialogRef={dialogRef}
          files={files}
          setFiles={setFiles}
          disabled={posting}
        />
        <button
          className="flex items-center gap-2 self-center rounded-lg bg-violet-400 px-5 py-2 text-xl font-medium text-white shadow-md hover:bg-violet-300 disabled:bg-violet-300"
          type="submit"
          disabled={posting}
        >
          {posting ? "processing..." : "Post"}
          {posting && <ImSpinner2 className="size-5 animate-spin" />}
        </button>
      </form>
      <BigCarousel
        dialogRef={dialogRef}
        files={files}
        fileIdx={fileIdx}
        setFileIdx={setFileIdx}
      />
    </div>
  );
}

function TitleInput({ draft, disabled }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col">
      <textarea
        id="title-input"
        placeholder="Enter the title"
        value={draft.title}
        maxLength={300}
        disabled={disabled}
        onChange={(e) =>
          dispatch(
            setDraft({
              ...draft,
              title: e.target.value.replace(/[\r\n]+/g, " "),
            }),
          )
        }
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="resize-none overflow-hidden break-words rounded-lg border border-gray-400 bg-white p-2 text-lg font-semibold placeholder:font-medium focus:border-gray-600"
      />
      <label htmlFor="title-input" className="mr-1 mt-1 flex self-end">
        <span className="align-top text-xs">{draft.title.length}/300</span>
      </label>
    </div>
  );
}

function BodyInput({ draft, disabled }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col overflow-clip rounded-lg border border-gray-400 bg-white has-[>textarea:focus]:border-gray-600">
      <span className="bg-gray-white hidden border p-2 align-top text-xs"></span>
      <textarea
        value={draft.body}
        placeholder="Enter the body"
        disabled={disabled}
        onChange={(e) => dispatch(setDraft({ ...draft, body: e.target.value }))}
        className="min-h-60 resize-none overflow-clip break-words bg-white p-2 font-medium"
      />
      <label className="flex self-end bg-teal-200"></label>
    </div>
  );
}

function MediaInput({ disabled, setFileIdx, dialogRef, files, setFiles }) {
  const videoRefs = useRef([]);

  async function handleMediaInput(e) {
    const inputFiles = e.target.files;
    if (!inputFiles) return;

    for (const file of inputFiles)
      setFiles((files) => [
        ...files,
        { media: file, url: URL.createObjectURL(file) },
      ]);

    e.target.value = [];
  }

  return (
    <div className="flex flex-wrap gap-3">
      {files.map((file, i) => (
        <div
          key={i}
          className="relative flex size-20 items-center justify-center overflow-clip rounded-lg border-2 border-gray-300 shadow-lg"
        >
          <div
            onClick={() => {
              setFileIdx(i);
              dialogRef.current.showModal();
            }}
            className="relative flex size-[4.5rem] overflow-clip rounded-lg"
          >
            {file.media.type.startsWith("image/") ? (
              <img
                src={file.url}
                className="aspect-square rounded-md border object-cover shadow-lg"
              />
            ) : file.media.type.startsWith("video/") ? (
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                className="m-auto rounded-lg"
              >
                <source key={i} src={file.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
          {!disabled && (
            <FiMinusCircle
              size={20}
              onClick={() => {
                URL.revokeObjectURL(file.url);
                setFiles((files) => files.filter((_video, idx) => i !== idx));
                videoRefs.current?.forEach((ref) => ref.current?.load());
              }}
              className="absolute right-0 top-0 cursor-pointer rounded-full text-red-600 hover:text-red-500"
            />
          )}
        </div>
      ))}
      <label className="h-fit cursor-pointer rounded-md border-2 border-gray-400 bg-gray-200">
        <div className="flex size-20 flex-col items-center justify-center gap-1">
          <MdOutlineVideoLibrary size={20} />
          <span className="mt-1 cursor-pointer text-center text-xs font-semibold leading-none">
            add
            <br />
            media
          </span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onInput={handleMediaInput}
          disabled={disabled}
          hidden
        />
      </label>
    </div>
  );
}
