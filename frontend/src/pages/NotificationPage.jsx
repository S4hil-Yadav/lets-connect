import Avatar from "react-avatar";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FollowerRequestsDialog from "../components/followRequestComponents/FollowerRequestsDialog";

export default function NotificationPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      axios
        .get("/api/v1/notifications/get-notifications")
        .then((res) => res.data),
  });

  if (isError) return <>Failed to get notifications</>;
  if (isLoading) return <>Loading notifications</>;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-gray-50 p-5 md:px-10">
      <span className="text-center text-4xl font-bold text-gray-700">
        Notifications
      </span>
      <ul className="mt-10 flex w-full flex-col gap-5">
        <FollowerRequestsDialog count={data?.followerRequestCount} />
        {data?.notifications?.map((notification) => (
          <li key={notification._id} className="flex w-full items-center">
            <NotificationCard notification={notification} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotificationCard({ notification }) {
  function generateMessage() {
    const { title: postTitle, body: postBody } = notification?.post || {};
    const postTag =
      postTitle?.slice(0, 20) + (postTitle?.length > 20 ? "..." : "") &&
      postBody?.slice(0, 20) + (postBody?.length > 20 ? "..." : "");

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
  }

  const msg = generateMessage();

  return (
    <div className="relative flex w-full items-center justify-between rounded-md bg-white px-3 py-3 shadow-md">
      <div className="flex w-full gap-3">
        <Avatar
          src={notification?.sender?.profilePic}
          name={notification?.sender?.fullname}
          size="50"
          round={true}
        />
        <div className="flex w-[calc(100%-4rem)] flex-col break-words">
          <span className="font-bold">{notification.sender.fullname}</span>
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
