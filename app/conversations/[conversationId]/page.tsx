import getConversationById from "@/app/actions/getConversationById";
import EmptyState from "@/components/empty-state";
import clsx from "clsx";

import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import getMessages from "@/app/actions/getMessages";

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId)

  // console.log("messages", messages);

  if (!conversation) {
    return (
      <div className="lg:pl-96 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-96 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages || []} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
