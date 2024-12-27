import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FollowButton, UnfollowButton } from "../components/Buttons";
import { UsersDialog } from "../components/Dialogs";
import Avatar from "react-avatar";
import { fetchUser } from "../redux/user/userSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);

  const userId = queryParams.get("id");
  console.log(userId);

  const { authUser } = useSelector((state) => state.user);

  const [user, setUser] = useState({});

  useEffect(() => {
    userId !== authUser._id ? getUser() : dispatch(fetchUser(authUser._id));
    async function getUser() {
      const res = await fetch("/api/v1/users/get-user/" + userId);
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message);
      setUser(data);
    }
  }, [userId, authUser._id, dispatch]);

  const {
    fullname,
    username,
    email,
    posts,
    followers,
    bio,
    following,
    profilePic,
  } = userId === authUser._id ? authUser : user;

  console.log("UwU");

  const editProfileDialogRef = useRef(null),
    followersDialogRef = useRef(null),
    followingDialogRef = useRef(null);

  // eslint-disable-next-line no-unused-vars
  function toggleEditProfileDialog() {
    const dialog = editProfileDialogRef.current;
    dialog && (dialog.open ? dialog.close() : dialog.showModal());
  }

  function toggleFollowersDialog() {
    const dialog = followersDialogRef.current;
    dialog && (dialog.open ? dialog.close() : dialog.showModal());
  }

  function toggleFollowingDialog() {
    const dialog = followingDialogRef.current;
    dialog && (dialog.open ? dialog.close() : dialog.showModal());
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-yellow-200 lg:flex-row">
      <div className="sticky top-0 flex max-h-screen flex-col gap-5 bg-white lg:order-last lg:max-w-[30%]">
        <div className="flex items-center justify-center gap-1 bg-white px-5 pt-10 lg:flex-col lg:justify-normal lg:gap-3">
          <div className="flex flex-col items-center gap-4">
            <Avatar src={profilePic} name={fullname} size="100" round={true} />
            {userId !== authUser._id && (
              <div className="flex flex-col justify-center gap-2 bg-lime-200 md:flex-row lg:hidden">
                <FollowButton />
                <UnfollowButton />
              </div>
            )}
          </div>
          <div className="max-w-20 flex-1 lg:flex-none" />
          <div className="flex max-w-full flex-col items-center gap-5 bg-purple-200">
            <div className="flex w-full flex-1 flex-col bg-pink-200">
              <div className="flex w-auto flex-wrap items-baseline justify-center gap-1">
                <span className="text-wrap text-lg font-semibold">
                  {fullname}
                </span>
                <span className="text-sm font-medium">({username})</span>
              </div>
              <span className="break-words text-center text-sm font-extrabold">
                {email}
              </span>
            </div>
            <div className="flex justify-between gap-3 bg-emerald-200">
              <button className="flex flex-col items-center">
                <span className="text-sm md:text-base">Posts</span>
                <span className="text-xs md:text-sm">
                  {posts ? posts.length : "_"}
                </span>
              </button>

              <button
                className="flex flex-col items-center"
                onClick={toggleFollowersDialog}
              >
                <span className="text-sm md:text-base">Followers</span>
                <span className="text-xs md:text-sm">
                  {followers ? followers.length : "_"}
                </span>
              </button>
              <UsersDialog
                heading="Followers"
                users={followers}
                dialogRef={followersDialogRef}
                handleClose={toggleFollowersDialog}
              />

              <button
                className="flex flex-col items-center"
                onClick={toggleFollowingDialog}
              >
                <span className="text-sm md:text-base">Following</span>
                <span className="text-xs md:text-sm">
                  {following ? following.length : "_"}
                </span>
              </button>
              <UsersDialog
                heading="Following"
                users={following}
                dialogRef={followingDialogRef}
                handleClose={toggleFollowingDialog}
              />
            </div>
            {userId !== authUser._id && (
              <div className="hidden justify-center gap-10 bg-lime-200 lg:flex">
                <FollowButton />
                <UnfollowButton />
              </div>
            )}
          </div>
        </div>

        <div className="mx-3 bg-blue-200 lg:h-full">
          <h4 className="bg-purple-200 text-lg font-bold">About</h4>
          <p className="break-words bg-slate-200 pl-5 text-justify text-sm">
            {bio +
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia sed enim excepturi a adipisci porro, illum harum exercitationem officia officiis explicabo? Hic voluptas omnis itaque sapiente nulla non magni alias."}
          </p>
        </div>
      </div>
      <div className="h-[100rem] flex-1"></div>
    </div>
  );
}
