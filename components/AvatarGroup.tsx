"use client"

import { User } from "@prisma/client"
import Image from "next/image"

interface AvatarGroupProps{
    users : User[]
}

const AvatarGroup : React.FC<AvatarGroupProps> = ({
    users = []
}) => {

    const sliceUser = users.slice(0,3)

    const positionMap = {
        0 : "top left-[12px]",
        1 : "bottom-0",
        2 : "bottom-0 right-0"
    }

  return (
    <div className="relative h-11 w-11">
        {sliceUser.map((user,index) => (
            <div
            key={user.id}
            className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${positionMap[index as keyof typeof positionMap]}`}
            >
            <Image
            fill
            alt="avatar"
            src={user?.image || '/images/placeholder.jpg'}
            />
            </div>
        ))}
    </div>
  )
}

export default AvatarGroup