import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { IoSearch, IoCreateOutline } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { useQueryClient } from "@tanstack/react-query";
import { useGetNotificationsQuery } from "@/lib/queries/notification.queries";
import { useMemo } from "react";
import { useGetFollowerRequestsQuery } from "@/lib/queries/user.queries";

export default function SideNavbar() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return (
    <div className="sticky inset-0 flex border-t-2 border-gray-300 bg-gray-200 px-2 md:h-screen md:flex-col md:justify-between md:border-r-2 md:border-t-0">
      <div className="my-1 flex h-full w-full justify-around overflow-y-auto scrollbar md:flex-col md:justify-between">
        <LinkButton linkTo="home" Icon={HiOutlineHome} />
        <LinkButton linkTo="search" Icon={IoSearch} />
        <LinkButton linkTo="create" Icon={IoCreateOutline} />
        <LinkButton linkTo="notifications" Icon={MdNotificationsNone} />
        <div className="hidden md:block md:flex-grow" />
        <LinkButton linkTo="settings" Icon={RiSettings4Line} />
        <LinkButton
          linkTo={"profile/" + (authUser?._id || "")}
          Icon={FaRegCircleUser}
        />
      </div>
    </div>
  );
}

function LinkButton({ linkTo, Icon }) {
  const location = useLocation();

  return (
    <Link
      to={linkTo}
      active={location.pathname === "/" + linkTo ? "true" : "false"}
      className={`w-auto rounded-md hover:bg-opacity-50 active:bg-opacity-100 md:mx-3 md:my-2 md:min-w-10 md:hover:bg-gray-100 md:hover:shadow-md ${linkTo === "settings" && "hidden md:block"}`}
    >
      <button
        className={`group relative flex w-full items-center gap-3 text-gray-600 transition-none hover:text-gray-800 md:py-2 md:pl-3 md:pr-4 ${location.pathname === "/" + linkTo && "text-violet-700 hover:text-violet-800"}`}
      >
        <div className="relative py-2 md:py-0">
          {useMemo(
            () => linkTo === "notifications" && <NotificationPing />,
            [linkTo],
          )}
          {Icon && <Icon size={20} className="transition-none" />}
        </div>
        <span className="hidden cursor-pointer font-semibold capitalize md:block">
          {linkTo.split("/")[0]}
        </span>
      </button>
    </Link>
  );
}

function NotificationPing() {
  const { data: notifications } = useGetNotificationsQuery(),
    location = useLocation();
  const { data: followRequests } = useGetFollowerRequestsQuery();

  const hasUnreadFollowRequest = useMemo(
    () => followRequests?.some((req) => !req.read),
    [followRequests],
  );
  const hasUnreadNotification = useMemo(
    () => notifications?.some((notification) => !notification.read),
    [notifications],
  );

  if (
    location.pathname !== "/notifications" &&
    (hasUnreadFollowRequest || hasUnreadNotification)
  )
    return (
      <div className="absolute right-0 top-1 size-[0.35rem] animate-ping rounded-full bg-green-700 md:top-0" />
    );

  return null;
}
