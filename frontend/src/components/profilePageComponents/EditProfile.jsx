import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, SubmitButton } from "../Input";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import Avatar from "react-avatar";
import { MdOutlineEdit } from "react-icons/md";
import { useUpdateUserMutation } from "@/lib/mutations/auth.mutations";

export default function EditProfile() {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  const location = useLocation();
  const navigate = useNavigate();

  const { mutateAsync: handleUpdate, isPending } = useUpdateUserMutation();

  const [userFields, setUserFields] = useState({
    fullname: authUser?.fullname,
    username: authUser?.username,
    email: authUser?.email,
    profilePic: authUser?.profilePic,
  });
  const pfpRef = useRef(null);

  const [changed, setChanged] = useState(false);

  function handleChange(e) {
    setUserFields({ ...userFields, [e.target.id]: e.target.value.trimStart() });
    setChanged(true);
  }

  async function handleImageUpload(e) {
    const pfp = e.target.files[0];
    if (!pfp) return;

    const reader = new FileReader();

    reader.readAsDataURL(pfp);

    reader.onload = () =>
      setUserFields({ ...userFields, profilePic: reader.result });

    setChanged(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (!userFields.fullname || !userFields.username || !userFields.email)
        throw new Error("All fields are required");

      if (!/.+@.+\..+/.test(userFields.email))
        throw new Error("Invalid email address");

      if (userFields.username.length > 20)
        throw new Error("Maximum username length is 20");

      if (
        userFields.fullname.split(" ").length > 5 ||
        !userFields.fullname.split(" ").every((part) => part.length <= 20)
      )
        throw new Error(
          "Only 5 words of max length 20 are allowed in full name",
        );

      await handleUpdate(userFields);
      setChanged(false);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Dialog
      defaultOpen
      onOpenChange={() =>
        navigate(
          location.state?.backgroundLocation.pathname ||
            "/profile/" + authUser?._id,
        )
      }
    >
      <DialogContent
        aria-describedby={undefined}
        className="h-screen max-h-screen w-screen max-w-screen-lg overflow-y-auto rounded-none md:h-fit md:max-w-screen-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col justify-between border-[5px] border-none"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-3">
            <label className="relative mx-auto w-fit cursor-pointer rounded-full border-8 border-double border-gray-600">
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute right-0 z-10 rounded-full bg-black bg-opacity-50 p-1 text-white">
                  <MdOutlineEdit size={30} />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="right"
                  className="min-w-40"
                >
                  <DropdownMenuItem onClick={() => pfpRef.current.click()}>
                    Change photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!userFields.profilePic}
                    onClick={() =>
                      setUserFields((prev) => {
                        setChanged(true);
                        return { ...prev, profilePic: "" };
                      })
                    }
                  >
                    Remove photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Avatar
                src={userFields.profilePic}
                name={userFields.fullname}
                size={130}
                onClick={() => pfpRef.current.click()}
                round
              />
              <input
                type="file"
                accept="image/*"
                ref={pfpRef}
                onInput={handleImageUpload}
                hidden
              />
            </label>
            <Input
              field="email"
              value={userFields.email}
              onChange={handleChange}
            />
            <Input
              field="username"
              value={userFields.username}
              onChange={handleChange}
            />
            <Input
              field="full name"
              value={userFields.fullname}
              onChange={handleChange}
              autoFocus={true}
            />
          </div>
          <div className="mb-4 mt-12 flex items-center overflow-clip rounded-2xl">
            <SubmitButton
              type="update"
              processing={isPending}
              disabled={!changed}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
