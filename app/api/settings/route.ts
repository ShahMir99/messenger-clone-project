import { getCurrentUser } from "@/app/actions/getSession";
import Prisma from "@/lib/Prismadb";
import { NextResponse } from "next/server";


export async function POST(resquest: Request) {
    try {
      const currentUser = await getCurrentUser();
      const body = await resquest.json();
  
      const { name, image } = body;
  
      if (!currentUser?.id || !currentUser?.email) {
        return new NextResponse("unauthorized", { status: 500 });
      }

    const updateProfile = await Prisma.user.update({
        where : {
            id : currentUser.id
        },
        data : {
            name,
            image
        }
    })
  
      return NextResponse.json(updateProfile)
  
    } catch (error: any) {
      console.log("Error_Settings", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  