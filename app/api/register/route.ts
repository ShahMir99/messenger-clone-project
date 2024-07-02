import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import Prisma from "@/lib/Prismadb";


export async function POST(req : Request){
    try{
        const data = await req.json();
        const {name , email , password} = data;

        if(!name || !email || !password){
            return new NextResponse("please enter complete info" , {status : 400 })
        }

        const findUser = await Prisma.user.findUnique({
            where : {
                email
            }
        })

        if(findUser){
            return new NextResponse("User already exist with same user name" , {status : 409 })
        }

        const hashedPassword = await bcrypt.hash(password , 12)

        const user = await Prisma.user.create({
            data : {
                name,
                email,
                hashedPassword
            }
        })


        return NextResponse.json(user)

    }catch(err){
        console.log("[REGISTER_ERROR]" , err)
        return new NextResponse("internal server error" , {status : 500})
    }
}