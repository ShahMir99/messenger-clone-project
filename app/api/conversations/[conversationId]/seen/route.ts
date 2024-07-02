import { getCurrentUser } from "@/app/actions/getSession";
import Prisma from "@/lib/Prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface Iparams {
  conversationId?: string;
}

export async function POST(resquest: Request, { params }: { params: Iparams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const conversation = await Prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });



    if (!conversation) {
      return new NextResponse("Invalid Id", { status: 500 });
    }

    const lastestMessage =
      conversation.messages[conversation.messages.length - 1];

    if (!lastestMessage) {
      return NextResponse.json(conversation);
    }

    const updateMessage = await Prisma.message.update({
      where: {
        id: lastestMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser?.email, "conversation:update", {
      id: conversationId,
      messages: [updateMessage],
    });

    if (lastestMessage.seenIds.indexOf(currentUser?.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updateMessage
    );

    return NextResponse.json(updateMessage);
  } catch (error: any) {
    console.log("Conversation_Id_Error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
