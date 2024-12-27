import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { excludeSideNavbarRoutes } from "../utils/routeUtil";
import { useSelector } from "react-redux";

export default function SideNavbar() {
  const { authUser } = useSelector((state) => state.user) || "";
  const location = useLocation();

  return (
    !excludeSideNavbarRoutes.includes(location.pathname) && (
      <div className="sticky inset-0 flex border-t-2 border-gray-300 bg-gray-200 p-2 md:h-screen md:flex-col md:justify-between md:border-r-2 md:border-t-0">
        <div className="my-1 flex h-full w-full justify-around overflow-y-auto scrollbar md:flex-col md:justify-between">
          <LinkButton linkTo="home" Icon={HiOutlineHome} />
          <LinkButton linkTo="search" Icon={IoSearch} />
          <LinkButton linkTo="create" Icon={IoCreateOutline} />
          <LinkButton linkTo="notifications" Icon={MdNotificationsNone} />
          <div className="hidden md:block md:flex-grow" />
          <LinkButton linkTo="settings" Icon={RiSettings4Line} />
          <LinkButton
            linkTo={`profile?id=${authUser?._id}`}
            Icon={FaRegCircleUser}
          />
        </div>
      </div>
    )
  );
}

function LinkButton({ linkTo, Icon }) {
  return (
    <Link
      to={linkTo}
      active={location.pathname === "/" + linkTo ? "true" : "false"}
      className={`w-auto rounded-md hover:bg-opacity-50 active:bg-opacity-100 md:mx-3 md:my-2 md:min-w-10 md:hover:bg-gray-100 md:hover:shadow-md ${linkTo === "settings" && "hidden md:block"}`}
    >
      <button
        className={`group flex w-full items-center gap-3 text-gray-600 transition-none hover:text-gray-800 md:py-2 md:pl-3 md:pr-4 ${location.pathname === "/" + linkTo && "text-violet-700 hover:text-violet-800"}`}
      >
        {Icon && <Icon className="size-5 transition-none" />}
        <span className="hidden cursor-pointer font-semibold capitalize md:block">
          {linkTo.split("?")[0]}
        </span>
      </button>
    </Link>
  );
}
