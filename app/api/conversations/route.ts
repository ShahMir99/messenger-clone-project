import { getCurrentUser } from "@/app/actions/getSession";
import Prisma from "@/lib/Prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("invalid data", { status: 400 });
    }

    // if (isGroup) {
    //   const newConversation = await Prisma.conversation.create({
    //     data: {
    //       name,
    //       isGroup,
    //       users: {
    //         connect: [
    //           ...members.map((member: { value: string }) => ({
    //             id: member.value,
    //           })),
    //           {
    //             id: currentUser.id,
    //           },
    //         ],
    //       },
    //     },
    //     include: {
    //       users: true,
    //     },
    //   });

    //   newConversation.users.forEach((user) => {
    //     if (user.email) {
    //       pusherServer.trigger(user.email, "conversation:new", newConversation);
    //     }
    //   });

    //   return NextResponse.json(newConversation);
    // }

    const existingConversation = await Prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversation[0];
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await Prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.forEach((users) => {
      pusherServer.trigger(
        users?.email!,
        "conversation:add",
        newConversation
      );
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
