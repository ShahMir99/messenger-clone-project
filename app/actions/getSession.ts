import { getServerSession } from "next-auth";

import Prisma from "@/lib/Prismadb";
import { authOptions } from "@/utils/authOptions";

export default async function getSession(){
    return await getServerSession(authOptions)
}

export const getCurrentUser = async () => {
    const session = await getSession()

    if(!session?.user?.email){
        return null
    }

    try{

        const user = await Prisma.user.findUnique({
            where : {
                email : session?.user?.email as string
            }
        })

        if(!user){
            return null;
        }

        return user;

    }catch(err){
        console.log(err)
    }
}