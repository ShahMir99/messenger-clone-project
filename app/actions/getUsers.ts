import Prisma from "@/lib/Prismadb"
import getSession from "./getSession"

const getUser = async () => {

    const session = await getSession()

    if(!session?.user?.email){
        return []
    }

    try{

        const users = await Prisma.user.findMany({
            orderBy : {
                createdAt : "desc"
            },
            where : {
                NOT : {
                    email : session.user.email
                }
            }
        })

        return users;

    }catch(err){
        console.log(err)
        return []
    }
}

export default getUser;