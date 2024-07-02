"use client";

import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import useConversation from "@/app/hooks/useConversation";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FullConversationType } from "@/types";
import { useRouter } from "next/navigation";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import { getCurrentUser } from "@/app/actions/getSession";

interface ConversationsListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setModalOpen] = useState(false);
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if(!pusherKey){
      return
    }

    pusherClient.subscribe(pusherKey)

    const addHandler = (conversation : FullConversationType) => {

      console.log(conversation)

      setItems((current) => {
        if(find(current, {id :conversation.id })){
          return current
        }

        return [conversation, ...current]
      })
    }

    const updateHandler = (conversation : FullConversationType) => {

      setItems((current) => current.map((currentConversation) => {
        if(currentConversation.id === conversation.id){
          return {
           ...currentConversation,
           messages :  conversation.messages
          }
        }
        return currentConversation
      }))
    }

    const removeHandler = (conversation : FullConversationType) => {
      console.log(conversation)
        setItems((current) => {
          return [...current.filter((conv) => conv.id !== conversation.id)]
        })
    }

    pusherClient.bind("conversation:add" , addHandler)
    pusherClient.bind("conversation:update" , updateHandler)
    pusherClient.bind("conversation:remove" , removeHandler)

    return () => {
      pusherClient.unsubscribe(pusherKey)
      pusherClient.unbind("conversation:add" , addHandler)
      pusherClient.unbind("conversation:update" , updateHandler)
      pusherClient.unbind("conversation:remove" , removeHandler)
    }
  },[pusherKey])


  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        users={users}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 lg:pb-0 pb-20 px-2 lg:left-20 lg:px-0 lg:w-[305px] lg:block overflow-y-auto border-r border-gray-200",
          isOpen ? "hidden" : "block w-full lg:left-20"
        )}
      >
        <div className="px-2">
          <div className="flex items-center justify-between py-3">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          <div className="">
            {items.map((item) => (
              <ConversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ConversationsList;
