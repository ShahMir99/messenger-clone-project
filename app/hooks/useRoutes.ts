import {usePathname} from "next/navigation"
import { useMemo } from "react"
import useConversation from "./useConversation"

import {HiChat} from "react-icons/hi"
import {HiArrowLeftOnRectangle, HiUser} from "react-icons/hi2"
import { signOut } from "next-auth/react"

const useRoutes = () => {
    const Pathname = usePathname()
    const {conversationId} = useConversation()

    const routes = useMemo(() => [
        {
            label : "Chat",
            href : "/conversations",
            icon : HiChat,
            active : Pathname === "/conversations" || !!conversationId
        },
        {
            label : "User",
            href : "/user",
            icon : HiUser,
            active : Pathname === "/user"
        },
        {
            label : "LogOut",
            href : "#",
            icon : HiArrowLeftOnRectangle,
            onClick : signOut,
        },
    ],[Pathname,conversationId])

    return routes;
}

export default useRoutes;