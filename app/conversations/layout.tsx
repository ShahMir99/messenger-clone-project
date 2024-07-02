import Sidebar from "@/components/sidebar/Sidebar";
import ConversationsList from "./components/ConversationsList";
import { getConversations } from "../actions/getConversations";
import getUser from "../actions/getUsers";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const conversations = await getConversations()
  const users = await getUser()

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationsList initialItems={conversations} users={users}/>
        {children}
      </div>
    </Sidebar>
  );
}
