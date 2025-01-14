import Avatar from "react-avatar";
import moment from "moment";
import FollowerRequestsDialog from "../components/notificationPageComponents/FollowerRequestsDialog";
import { useMemo } from "react";
import { useGetNotificationsQuery } from "@/lib/queries/notification.queries";
import { Link, useLocation } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";

export default function NotificationPage() {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetNotificationsQuery();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-gray-50 p-5 md:px-10">
      <span className="mb-8 text-center text-4xl font-bold text-gray-700">
        Notifications
      </span>
      {useMemo(
        () => (
          <FollowerRequestsDialog />
        ),
        [],
      )}
      {isLoading ? (
        <ImSpinner2 className="mt-5 size-7 w-full animate-spin text-violet-700" />
      ) : isError ? (
        "Failed to get notifications"
      ) : !notifications.length ? (
        "You don't have any notifications"
      ) : (
        <ul className="flex w-full flex-col gap-5">
          {notifications.map((notification) => (
            <li key={notification._id} className="flex w-full items-center">
              <NotificationCard notification={notification} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NotificationCard({ notification }) {
  const location = useLocation();

  const msg = useMemo(
    function generateMessage() {
      const { title: postTitle, body: postBody } = notification?.post || {};
      const postTag =
        postTitle?.slice(0, 20) ||
        postBody?.slice(0, 20) ||
        "" +
          (postTitle?.length > 20
            ? "..."
            : !postTitle && postBody?.length > 20
              ? "..."
              : "");

      return notification.type === "followRequestReceived"
        ? ["wants to follow you", ""]
        : notification.type === "followRequestAccepted"
          ? ["accepted your follow request", ""]
          : notification.type === "post"
            ? ["posted ", postTag || "an image"]
            : notification.type === "postLike"
              ? ["liked your post ", postTag || ""]
              : notification.type === "comment"
                ? ["commented on your post ", `"` + postTitle + `"`]
                : ["", ""];
    },
    [notification],
  );

  const navPath = ["post", "postLike", "comment"].includes(notification.type)
    ? "/post/" + (notification.post?._id || "")
    : ["followRequestReceived", "followRequestAccepted"].includes(
          notification.type,
        )
      ? "/profile/" + notification.sender?._id
      : null;

  return (
    <div className="relative flex w-full items-center justify-between rounded-md bg-white px-3 py-3 shadow-md">
      <div className="flex w-full gap-3">
        <Link
          to={navPath}
          state={
            ["post", "postLike", "comment"].includes(notification.type)
              ? { backgroundLocation: location }
              : null
          }
          aria-hidden="true"
          className="absolute inset-0 left-[4.5rem] top-9"
        />
        <Link to={"/profile/" + notification.sender?._id}>
          <Avatar
            src={notification?.sender?.profilePic}
            name={notification?.sender?.fullname}
            size="50"
            round={true}
          />
        </Link>
        <div className="flex w-[calc(100%-4rem)] flex-col break-words">
          <Link
            to={"/profile/" + notification.sender?._id}
            className="w-fit font-bold"
          >
            {notification.sender.fullname}
          </Link>
          <span className="text-wrap break-words text-sm">
            {msg[0]}
            {msg[1] && <b className="font-semibold">{msg[1]}</b>}
          </span>
        </div>
      </div>
      <span className="absolute right-0 top-2 mx-3 text-xs font-semibold text-gray-500">
        {moment(notification.createdAt).fromNow()}
      </span>
    </div>
  );
}
