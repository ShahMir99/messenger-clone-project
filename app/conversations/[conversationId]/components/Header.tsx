"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/components/Avatar";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/components/AvatarGroup";
import useActiveList from "@/app/hooks/userActiveList";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser[0]?.email!) !== -1;

  const StatusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return isActive ? "active" : "offline";
  }, [conversation]);

  return (
    <>
    <ProfileDrawer
    data={conversation}
    isOpen={drawerOpen}
    onClick={() => setDrawerOpen(false)}
    />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center ">
          <Link
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
            href="/conversations"
          >
            <HiChevronLeft size={25} />
          </Link>
          {conversation.isGroup ? (
        <AvatarGroup users={conversation.users} />
      ) : (
        <Avatar user={otherUser[0]} />
      )}
          <div className="flex flex-col">
            <div className="font-medium capitalize">
              {conversation?.name || otherUser[0].name}
            </div>
            <div className="text-sm font-light capitalize">{StatusText}</div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="text-blue-500 cursor-pointer hover:text-blue-600 transition"
        />
      </div>
    </>
  );
};

export default Header;
