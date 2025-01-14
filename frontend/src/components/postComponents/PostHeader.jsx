import Avatar from "react-avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PostHeader({ publisher }) {
  return (
    <div className="flex w-full items-center justify-between text-wrap border-b border-gray-200 pb-4">
      <Link to={"/profile/" + publisher._id} className="flex gap-3">
        <div className="rounded-full border border-gray-300">
          <Avatar
            src={publisher.profilePic}
            name={publisher.fullname}
            round
            size="45"
          />
        </div>
        <div className="flex w-[calc(100%-2.5rem)] flex-col text-wrap break-words text-sm">
          <span className="font-bold">{publisher.fullname}</span>
          <span className="font-semibold text-gray-500">
            {publisher.username}
          </span>
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsThreeDotsVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="left" className="min-w-40">
          {/* <DropdownMenuLabel>Post actions</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
          <DropdownMenuItem>Share post</DropdownMenuItem>
          <DropdownMenuItem>Report user</DropdownMenuItem>
          <DropdownMenuItem>Block user</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
