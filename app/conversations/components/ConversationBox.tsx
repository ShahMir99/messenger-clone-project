"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType } from "@/types";
import Avatar from "@/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import AvatarGroup from "@/components/AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {

  const otherUser = useOtherUser(data);
  const router = useRouter();
  const session = useSession();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.id === userEmail).length === 0;
  }, [userEmail, lastMessage]);


  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an Image";
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return "Started a conversation";
  }, [lastMessage?.body,lastMessage?.image]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full relative flex items-center space-x-3 p-2 hover:bg-neutral-100 transition cursor-pointer border-b border-gray-100",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser[0]} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center">
            <p className="text-base text-gray-900 font-medium">
              {data.name || otherUser[0].name}
              
            </p>
            {
                lastMessage?.createdAt && (
                  <p className="text-xs font-light text-gray-400">
                    {format(new Date(lastMessage.createdAt),'p')}
                  </p>
                )
              }
          </div>
          <p
          className={clsx("text-sm truncate font-medium", hasSeen ? "text-gray-500" : "text-black font-medium")}
          >{lastMessageText}</p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
