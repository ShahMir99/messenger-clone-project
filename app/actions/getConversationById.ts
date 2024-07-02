import Prisma from "@/lib/Prismadb";
import { getCurrentUser } from "./getSession";

const getConversationById = async (conversationId: string) => {
  try {
    const CurrentUser = await getCurrentUser();
    if (!CurrentUser?.email) {
      return null;
    }

    const conversation = await Prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch (error: any) {
    return null;
  }
};

export default getConversationById;
