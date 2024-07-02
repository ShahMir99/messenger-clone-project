"use client";

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItems from "./DesktopItems";
import { User } from "@prisma/client";
import Image from "next/image";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";

interface DesktopSideBarProp {
  user: User;
}

const DesktopSideBar: React.FC<DesktopSideBarProp> = ({ user }) => {
  const routes = useRoutes();
  const [isOpen, setOpen] = useState(false);

  return (
    <>
    <SettingsModal currentUser={user} isOpen={isOpen} onClose={() => setOpen(false)} />
      <div
        className="
          hidden
          lg:fixed
          lg:inset-y-0
          lg:left-0
          lg:w-20
          xl:px-6
          overflow-y-auto
          lg:bg-white
          lg:border-r-[1px]
          lg:pb-4
          lg:flex
          lg:flex-col
          justify-between
    "
      >
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
            "
        >
          <ul
            role="list"
            className="
              flex
              items-center
              flex-col
              space-y-1
        "
          >
            {routes.map((item) => (
              <DesktopItems
                key={item.label}
                href={item.href}
                label={item.label}
                Icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
            items-center
      "
        >
          <div
            onClick={() => setOpen(true)}
            className="
              cursor-pointer
              hover:opacity-75
              transition
       "
          >
            <Avatar user={user} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSideBar;
