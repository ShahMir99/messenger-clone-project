import Sidebar from "@/components/sidebar/Sidebar";
import UserList from "./components/user-list";
import getUser from "../actions/getUsers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions/getSession";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const users = await getUser()
  const currentUser = await getCurrentUser()

  // if(!currentUser?.id){
  //   return redirect("/")
  // }

  return (
    <Sidebar>
      <div className="h-full">
        <UserList users={users}/>
        {children}
      </div>
    </Sidebar>
  );
}
