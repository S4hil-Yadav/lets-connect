import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegPlusSquare } from "react-icons/fa";
import { FiMinusCircle } from "react-icons/fi";
import { CgSpinnerTwo } from "react-icons/cg";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function CreatePostPage() {
  const [post, setPost] = useState({ title: "", body: "", images: [] });

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: (post) => axios.put("/api/v1/posts/create-post", post),
    onSuccess: () => {
      setPost({ title: "", body: "", images: [] });
      toast.success("Posted");
    },
    onError: (err) =>
      toast.error(err.response.data.message || "Something went wrong"),
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!post.body.trim() && !post.images.length)
        throw new Error("Post can't be empty");

      createPostMutation(post);
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
        <TitleInput post={post} setPost={setPost} />
        <BodyInput post={post} setPost={setPost} />
        <ImageInput post={post} setPost={setPost} />
        <button
          className="w-fit self-center rounded-lg bg-violet-400 px-5 py-3 text-xl font-medium text-white shadow-md"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "processing..." : "Post"}
          {isPending && <CgSpinnerTwo className="size-5 animate-spin" />}
        </button>
      </form>
    </div>
  );
}

function TitleInput({ post, setPost }) {
  function handleTitleChange(e) {
    e.target.value = e.target.value.replace(/[\r\n]+/g, " ");
    setPost({ ...post, title: e.target.value });
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  return (
    <div className="flex flex-col">
      <textarea
        id="title-input"
        placeholder="Enter the title"
        value={post.title}
        maxLength={300}
        autoFocus
        onChange={handleTitleChange}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="resize-none overflow-hidden break-words rounded-lg border border-gray-400 bg-white p-2 text-lg font-semibold focus:border-gray-600"
      />
      <label htmlFor="title-input" className="mr-1 mt-1 flex self-end">
        <span className="align-top text-xs">{post.title.length}/300</span>
      </label>
    </div>
  );
}

function BodyInput({ post, setPost }) {
  function handleBodyChange(e) {
    setPost({ ...post, body: e.target.value });
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }
  return (
    <div className="flex flex-col overflow-clip rounded-lg border border-gray-400 bg-white has-[>textarea:focus]:border-gray-600">
      <span className="bg-gray-white hidden border p-2 align-top text-xs"></span>
      <textarea
        value={post.body}
        placeholder="Enter the body"
        autoFocus
        onChange={handleBodyChange}
        className="min-h-60 resize-none overflow-clip break-words bg-white p-2 font-medium"
      />
      <label className="flex self-end bg-teal-200"></label>
    </div>
  );
}

function ImageInput({ post, setPost }) {
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () =>
      setPost({ ...post, images: [...post.images, reader.result] });

    e.target.value = [];
  }

  return (
    <div className="flex flex-wrap gap-3">
      {post.images.map((image, i) => (
        <div
          key={i}
          className="relative flex size-20 items-center rounded-lg border-2 border-gray-300 p-1 shadow-lg"
        >
          <img
            src={image}
            className="size-fit rounded-md border object-contain shadow-lg"
          />
          <FiMinusCircle
            onClick={() =>
              setPost({
                ...post,
                images: post.images.filter((_img, idx) => idx !== i),
              })
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
          hidden
        />
      </label>
    </div>
  );
}
