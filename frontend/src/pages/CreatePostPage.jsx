import toast from "react-hot-toast";
import { FaRegPlusSquare } from "react-icons/fa";
import { FiMinusCircle } from "react-icons/fi";
import { CgSpinnerTwo } from "react-icons/cg";
import { useCreatePostMutation } from "@/lib/mutations/post.mutations";
import { useDispatch, useSelector } from "react-redux";
import { setDraft, clearDraft, setPosting } from "@/redux/draft/draftSlice";
import BigCarousel from "@/components/postComponents/BigCarousel";
import { useRef, useState } from "react";

export default function CreatePostPage() {
  const dispatch = useDispatch(),
    { draft, posting } = useSelector((state) => state.draft);

  const imgDialogRef = useRef(null),
    [imgIdx, setImgIdx] = useState(0);

  const { mutateAsync: createPost } = useCreatePostMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!draft.body.trim() && !draft.images.length)
        throw new Error("Post can't be empty");

      dispatch(setPosting());
      await createPost(draft);
      dispatch(clearDraft());
    } catch (error) {
      toast.error(error.message);
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
        <ImageInput
          draft={draft}
          setImgIdx={setImgIdx}
          imgDialogRef={imgDialogRef}
          disabled={posting}
        />
        <button
          className="flex items-center gap-2 self-center rounded-lg bg-violet-400 px-5 py-2 text-xl font-medium text-white shadow-md hover:bg-violet-300 disabled:bg-violet-300"
          type="submit"
          disabled={posting}
        >
          {posting ? "processing..." : "Post"}
          {posting && <CgSpinnerTwo className="size-5 animate-spin" />}
        </button>
      </form>
      <BigCarousel
        dialogRef={imgDialogRef}
        images={draft.images}
        imgIdx={imgIdx}
        setImgIdx={setImgIdx}
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

function ImageInput({ draft, disabled, setImgIdx, imgDialogRef }) {
  const dispatch = useDispatch();

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () =>
      dispatch(
        setDraft({ ...draft, images: [...draft.images, reader.result] }),
      );

    e.target.value = [];
  }

  return (
    <div className="flex flex-wrap gap-3">
      {draft.images.map((image, i) => (
        <div
          key={i}
          className="relative flex size-20 items-center rounded-lg border-2 border-gray-300 p-1 shadow-lg"
        >
          <img
            src={image}
            onClick={() => {
              setImgIdx(i);
              imgDialogRef.current.showModal();
            }}
            className="aspect-square rounded-md border object-cover shadow-lg"
          />
          <FiMinusCircle
            onClick={() =>
              dispatch(
                setDraft({
                  ...draft,
                  images: draft.images.filter((_img, idx) => idx !== i),
                }),
              )
            }
            className="absolute right-0 top-0 size-5 cursor-pointer rounded-full text-red-500"
          />
        </div>
      ))}
      <label className="cursor-pointer rounded-md border-2 border-gray-400 bg-gray-200">
        <div className="flex size-20 flex-col items-center justify-center gap-1">
          <FaRegPlusSquare size={25} />
          <span className="cursor-pointer text-xs font-semibold leading-none">
            add an
            <br />
            image
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          onInput={handleImageUpload}
          disabled={disabled}
          hidden
        />
      </label>
    </div>
  );
}
