import { getCurrentUser } from "@/app/actions/getSession";
import Prisma from "@/lib/Prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface Iparams {
  conversationId?: string;
}

export async function DELETE(
  resquest: Request,
  { params }: { params: Iparams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const existingConversation = await Prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 401 });
    }

    const deleteConversation = await Prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((users) => {
      pusherServer.trigger(
        users?.email!,
        "conversation:remove",
        existingConversation
      );
    });

    return NextResponse.json(deleteConversation);
  } catch (error: any) {
    console.log("Conversation_Id_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
