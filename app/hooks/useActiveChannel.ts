import { useEffect, useState } from "react";
import useActiveList from "./userActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [ActiveChannel, setActiveChannel] = useState<Channel | null>(null);

  console.log("ActiveChannel",ActiveChannel)

  useEffect(() => {
    let channel = ActiveChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      console.log(members)

      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (ActiveChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [ActiveChannel, set, add, remove]);
};

export default useActiveChannel;
