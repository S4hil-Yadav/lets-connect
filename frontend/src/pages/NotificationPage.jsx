import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import moment from "moment";
import { TbUsersPlus } from "react-icons/tb";
import { useRef } from "react";
import { FollowerRequestsDialog } from "../components/Dialogs";

export default function NotificationPage() {
  const {
    notifications,
    followerRequests,
    // _id: authUserId,
  } = useSelector((state) => state.user?.authUser);

  const followerRequestsSenders = followerRequests?.map(
    (followerRequest) => followerRequest?.sender,
  );

  const followerRequestsDialogRef = useRef(null);

  function toggleFollowerRequestsDialog() {
    const dialog = followerRequestsDialogRef.current;
    dialog && (dialog.open ? dialog.close() : dialog.showModal());
  }

  return (
    <div className="flex min-h-screen flex-1 bg-gray-100">
      {/* <div className="border-gray-300 bg-gray-200 bg-opacity-55 lg:order-last lg:flex lg:basis-5/12 lg:border-l-2" /> */}
      <ul className="mt-10 flex flex-1 flex-col gap-5">
        {followerRequests?.length ? (
          <button
            onClick={toggleFollowerRequestsDialog}
            className="relative mx-5 flex items-center rounded-md border-2 border-gray-400 bg-gray-200 bg-opacity-50 px-3 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 pl-4 md:gap-4">
              <TbUsersPlus size={30} className="h-10 text-purple-900" />
              <p className="cursor-pointer text-sm font-medium text-red-800 md:text-base">
                You have&nbsp;
                <span className="font-bold">{followerRequests?.length}</span>
                &nbsp;pending follow{" "}
                {followerRequests?.length === 1 ? "request" : "requests"}
                &nbsp;&nbsp;
                <span className="hidden cursor-pointer text-sm text-gray-600 md:inline">
                  (Click here to show)
                </span>
              </p>
            </div>
            <div className="absolute right-2 top-2 size-2 rounded-full bg-green-500 shadow-sm shadow-green-300"></div>
          </button>
        ) : null}
        <FollowerRequestsDialog
          heading="Follow Requests"
          senders={followerRequestsSenders}
          dialogRef={followerRequestsDialogRef}
          handleClose={toggleFollowerRequestsDialog}
        />
        {notifications?.map((notification) => (
          <li key={notification._id} className="flex items-center">
            <NotificationCard notification={notification} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotificationCard({ notification }) {
  function generateMessage(type) {
    return (
      (type === "followRequestReceived" && "wants to follow you") ||
      (type === "followRequestAccepted" && "accepted your follow request") ||
      (type === "post" && " posted " + notification?.post?.title) ||
      (type === "postLike" &&
        " liked your post " + notification?.post?.title) ||
      (type === "comment" &&
        " commented on your post " + notification?.post?.title)
    );
  }

  return (
    <div className="relative mx-5 flex flex-1 items-center justify-between rounded-md bg-gray-50 px-3 py-3 shadow-md">
      <div className="flex gap-3">
        <Avatar
          src={notification?.sender?.profilePic}
          name={notification.sender.fullname}
          size="50"
          round={true}
        />
        <div className="flex flex-col">
          <span className="font-bold">{notification.sender.fullname}</span>
          <span className="text-sm">{generateMessage(notification.type)}</span>
          <span></span>
        </div>
      </div>
      <span className="absolute right-0 top-2 mx-3 text-xs font-semibold text-gray-500">
        {moment(notification.createdAt).fromNow()}
      </span>
    </div>
  );
}
