import Prisma from "@/lib/Prismadb"
import { getCurrentUser } from "./getSession"


export const getConversations = async () => {

    const CurrentUser = await getCurrentUser()

    if(!CurrentUser?.id){
        return []
    }
    try{

        const conversations = await Prisma.conversation.findMany({
            orderBy : {
                lastMessageAt : "desc"
            },
            where : {
                userIds : {
                    has : CurrentUser.id
                }
            },
            include : {
                users : true,
                messages : {
                    include : {
                        sender : true,
                        seen : true
                    }
                }
            }
        })

        return conversations;

    }catch(error : any){
        return []
    }
}