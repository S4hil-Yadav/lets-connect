import Avatar from "react-avatar";
import moment from "moment";
import FollowerRequestsDialog from "../components/notificationPageComponents/FollowerRequestsDialog";
import { useEffect, useMemo } from "react";
import { useGetNotificationsQuery } from "@/lib/queries/notification.queries";
import { Link, useLocation } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import { MdErrorOutline } from "react-icons/md";
import { useMarkNotificationsAsReadQuery } from "@/lib/mutations/notification.mutations";
import { useQueryClient } from "@tanstack/react-query";

export default function NotificationPage() {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]),
    { data: notifications, isLoading, isError } = useGetNotificationsQuery(),
    { mutate: handleRead } = useMarkNotificationsAsReadQuery();

  useEffect(
    () => () => {
      const unread = notifications?.flatMap((notification) =>
        notification.read ? [] : [notification._id],
      );

      if (!unread?.length) return;

      queryClient.setQueryData(
        ["notifications", authUser?._id],
        (notifications) =>
          notifications?.map((notification) => ({
            ...notification,
            read: true,
          })),
      );

      handleRead(unread);
    },
    [authUser?._id, handleRead, notifications, queryClient],
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 p-5 md:px-10">
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
        <span className="flex items-center gap-3 self-center text-lg font-medium">
          Couldn&apos;t load notifications
          <MdErrorOutline size={25} />
        </span>
      ) : !notifications.length ? (
        <span className="flex items-center gap-3 text-lg font-medium">
          You don&apos;t have notifications
        </span>
      ) : (
        <ul className="flex w-full flex-col justify-center gap-5">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className="flex w-full items-center justify-center"
            >
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
                ? ["commented on your post ", postTag || ""]
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

  // console.log(notification.sender);

  return (
    <div
      className={`relative flex w-full max-w-3xl items-center justify-between rounded-md bg-white px-3 py-3 shadow-md hover:bg-gray-100 ${!notification.read && "border-2 border-red-300"}`}
    >
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
            src={notification.sender?.profilePic}
            name={notification.sender?.fullname}
            size="50"
            round={true}
          />
        </Link>
        <div className="flex w-[calc(100%-4rem)] flex-col break-words">
          <Link
            to={"/profile/" + notification.sender?._id}
            className="w-fit font-bold"
          >
            {notification.sender?.fullname || "[deleted user]"}
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
