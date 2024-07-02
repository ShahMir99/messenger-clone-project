"use client";

import Avatar from "@/components/Avatar";
import { FullMessageType } from "@/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface MessageBoxProps {
  isLast: boolean;
  data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
  const session = useSession();
  const isOwn = session.data?.user?.email === data?.sender?.email;
  
  const seenList = (data.seen || [])
  .filter((user) => user.email !== data?.sender?.email)
  .map((user) => user.name)
  .join(", ");
  

  return (
    <div className={clsx("flex gap-3 p-3", isOwn && "justify-end")}>
      <div className={clsx(isOwn && "order-2")}>
        <Avatar user={data.sender} />
      </div>
      <div className={clsx("flex flex-col gap-2", isOwn && "items-end")}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div
          className={clsx(
            "text-sm w-fit overflow-hidden",
            data.image ? "rounded-md p-0" : "rounded-full"
          )}
        >
          {data.image ? (
            <Image
              alt="Image"
              height={288}
              width={288}
              src={data.image}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div
              className={clsx(
                " px-3 py-2",
                isOwn ? "bg-sky-500 text-white" : "bg-gray-100"
              )}
            >
              {data.body}
            </div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen By ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
