import Avatar from "react-avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PostHeader({ publisher }) {
  return (
    <div className="flex w-full items-center gap-3 text-wrap border-b border-gray-200 pb-4">
      <Avatar
        src={publisher.profilePic}
        name={publisher.fullname}
        round={true}
        size="45"
      />
      <div className="flex w-[calc(100%-2.5rem)] flex-col text-wrap break-words text-sm">
        <span className="font-bold">{publisher.fullname}</span>
        <span className="font-semibold text-gray-500">
          {publisher.username}
        </span>
      </div>

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
