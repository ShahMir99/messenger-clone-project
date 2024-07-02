import { getCurrentUser } from "@/app/actions/getSession";
import Prisma from "@/lib/Prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(resquest: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await resquest.json();

    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("unauthorized", { status: 500 });
    }

    const newMessage = await Prisma.message.create({
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender : true
      },
    });

    const updateConverastion = await Prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    await pusherServer.trigger(conversationId, "messages:new", newMessage)

    const lastMessage = updateConverastion.messages[updateConverastion.messages.length - 1]

    updateConverastion.users.map((user) => {
      pusherServer.trigger(user.email!,"conversation:update",{
        id : conversationId,
        messages : [lastMessage] 
      })
    })

    return NextResponse.json(newMessage)

  } catch (error: any) {
    console.log("Error_Messages", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
