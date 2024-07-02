import Prisma from "@/lib/Prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcrypt"

export const authOptions : AuthOptions = {
    adapter : PrismaAdapter(Prisma),
    providers : [
        GithubProvider({
            clientId : process.env.GIT_HUBID as string,
            clientSecret : process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID as string,
            clientSecret : process.env.GOOGLE_SECRET as string
        }),
        CredentialsProvider({
            name : 'credentials',
            credentials : {
                email : {label : 'email' , type : 'text'},
                password : {label : 'password' , type : 'text'},
            },

            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error('Invalid Credentials')
                }

                const user = await Prisma.user.findFirst({
                    where : {
                        email : credentials?.email
                    }
                });

                if(!user || !user.hashedPassword){
                    throw new Error('Invalid Credentials')
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password , user.hashedPassword
                )

                if(!isCorrectPassword){
                    throw new Error('Invalid Credentials')
                }

                return user;

            }
        })
    ],
    debug : process.env.NODE_ENV === "development",
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET,
}