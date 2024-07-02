import { User } from "@prisma/client"
import UserBox from "./user-box"

interface UserListProps {
    users : User[]
}

const UserList : React.FC<UserListProps> = ({users}) => {
  return (
    <aside className="
    fixed
    inset-y-0
    bg-20
    lg:pb-0
    lg:left-20
    z-40
    lg:w-60
    lg:block
    overflow-y-auto
    border-r
    border-gray-200
    block
    w-full
    left-0
    ">
      <div className="px-5">
        <div className="flex-col">
          <h2 className="text-2xl font-bold text-neutral-800 py-4">People</h2>
        </div>
       {
        users.map((user) => (
          <UserBox 
          key={user.id}
          data={user}
          />
        ))
       }
      </div>
    </aside>
  )
}

export default UserList