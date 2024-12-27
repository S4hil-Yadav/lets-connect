import { IoCloseSharp } from "react-icons/io5";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, setLoading } from "../redux/user/userSlice";
import {
  acceptFollowRequest,
  cancelFollowRequest,
  rejectFollowRequest,
  sendFollowRequest,
  unFollow,
} from "../utils/reqUtils";
import toast from "react-hot-toast";
import { useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";

export function UsersDialog({ users, dialogRef, handleClose, heading }) {
  return (
    <dialog
      ref={dialogRef}
      className="max-h-[70%] min-w-64 rounded-md bg-blue-200 p-3 shadow-xl backdrop:bg-black backdrop:bg-opacity-60 md:translate-x-1/4 lg:-translate-x-[17%]"
    >
      <button className="absolute right-2 top-2" onClick={handleClose}>
        <IoCloseSharp />
      </button>
      <div className="flex flex-col gap-2 bg-red-200">
        <span className="pr-5 text-center text-xl font-bold">
          {heading || "Users"}
        </span>
        <Users users={users} handleClose={handleClose} />
      </div>
    </dialog>
  );
}

export function Users({ users, handleClose }) {
  const { authUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingButtons, setLoadingButtons] = useState({});

  async function handleFollowingRequest(user) {
    try {
      setLoadingButtons((prev) => ({ ...prev, [user._id + "u"]: true }));

      if (user._id === authUser._id) {
        navigate(`/profile?id=${authUser._id}`);
      } else if (authUser?.following?.some((usr) => usr._id === user._id)) {
        await unFollow(user._id);
        toast.success("Unfollowed");
      } else if (
        authUser?.followingRequests?.some(
          (req) => req.receiver._id === user._id,
        )
      ) {
        await cancelFollowRequest(user._id);
        toast.success("Follow request cancelled");
      } else {
        await sendFollowRequest(user._id);
        toast.success("Follow request sent");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(fetchUser());
      setLoadingButtons((prev) => ({ ...prev, [user._id + "u"]: false }));
    }
  }

  return (
    <ul className="flex w-full flex-col bg-violet-200">
      {users?.map((user) => (
        <li
          key={user._id}
          className="flex w-full items-center justify-between gap-2 border-b border-dashed border-slate-400 last:border-none"
        >
          <Link
            to={`/profile?id=${user._id}`}
            onClick={handleClose}
            className="flex cursor-pointer items-center gap-2 bg-lime-200 py-2"
          >
            <Avatar
              src={user.profilePic}
              name={user.fullname}
              size="50"
              round={true}
            />
            <div className="flex min-h-12 flex-col bg-pink-200">
              <span className="cursor-pointer text-wrap break-words font-semibold">
                {user.username}
              </span>
              <span className="cursor-pointer text-wrap break-words text-sm font-medium">
                {user.fullname + "1234567890123456789"}
              </span>
            </div>
          </Link>
          <button
            className="flex min-h-5 min-w-16 items-center justify-center rounded-lg bg-violet-400 px-1 py-1 text-base text-white disabled:cursor-default md:px-2"
            onClick={() => handleFollowingRequest(user)}
            disabled={loading[user._id] || loadingButtons[user._id]}
          >
            {user._id === authUser._id ? (
              "You"
            ) : loading[user._id] || loadingButtons[user._id] ? (
              <ImSpinner3 size={20} className="animate-spin cursor-default" />
            ) : authUser?.following?.some((usr) => usr._id === user._id) ? (
              "Unfollow"
            ) : authUser?.followingRequests?.some(
                (req) => req.receiver._id === user._id,
              ) ? (
              "Pending"
            ) : (
              "Follow"
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function FollowerRequestsDialog({
  senders,
  dialogRef,
  handleClose,
  heading,
}) {
  return (
    <dialog
      ref={dialogRef}
      className="max-h-[70%] rounded-md bg-blue-200 px-5 py-5 shadow-xl backdrop:bg-black backdrop:bg-opacity-60 md:translate-x-1/4 lg:-translate-x-[17%]"
    >
      <button className="absolute right-3 top-2" onClick={handleClose}>
        <IoCloseSharp />
      </button>
      <div className="flex flex-col gap-2 bg-red-200">
        <span className="pr-5 text-center text-xl font-bold">
          {heading || "Users"}
        </span>
        <Senders senders={senders} handleClose={handleClose} />
      </div>
    </dialog>
  );
}

function Senders({ senders, handleClose }) {
  const { loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  async function handleFollowerRequest(sender, action) {
    try {
      dispatch(setLoading(sender._id + "s" + action[0]));
      if (action === "accept") {
        await acceptFollowRequest(sender._id);
        toast.success("Follow request accepted");
      } else {
        await rejectFollowRequest(sender._id);
        toast.success("Follow request rejected");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(fetchUser(sender._id + "s" + action[0]));
    }
  }

  return (
    <ul className="flex flex-col bg-violet-200">
      {senders?.map((sender) => (
        <li
          key={sender._id}
          className="flex items-center border-b border-dashed border-slate-400 last:border-none"
        >
          <Link
            to={`/profile?id=${sender._id}`}
            onClick={handleClose}
            className="flex min-w-40 cursor-pointer items-center bg-lime-200 py-2"
          >
            <Avatar
              src={sender.profilePic}
              name={sender.fullname}
              size="50"
              round={true}
            />
            <div className="flex min-h-12 flex-col bg-pink-200 px-3">
              <span className="cursor-pointer font-semibold">
                {sender.username}
              </span>
              <span className="cursor-pointer text-xs font-medium text-gray-600">
                {sender.fullname}
              </span>
            </div>
          </Link>
          <div className="flex flex-1 justify-center">
            <button
              className="ml-2 flex w-16 justify-center bg-violet-400 p-1 px-2 text-sm disabled:cursor-default"
              onClick={() => handleFollowerRequest(sender, "reject")}
              disabled={
                loading[sender._id + "sr"] || loading[sender._id + "sa"]
              }
            >
              {loading[sender._id + "sr"] ? (
                <ImSpinner3 size={20} className="animate-spin cursor-default" />
              ) : (
                "Reject"
              )}
            </button>
            <button
              className="ml-2 flex w-16 justify-center bg-violet-400 p-1 px-2 text-sm disabled:cursor-default"
              onClick={() => handleFollowerRequest(sender, "accept")}
              disabled={
                loading[sender._id + "sa"] || loading[sender._id + "sr"]
              }
            >
              {loading[sender._id + "sa"] ? (
                <ImSpinner3 size={20} className="animate-spin cursor-default" />
              ) : (
                "Accept"
              )}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
