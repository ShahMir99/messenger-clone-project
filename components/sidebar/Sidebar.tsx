import { getCurrentUser } from "@/app/actions/getSession";
import DesktopSideBar from "./DesktopSideBar";
import MobileSideBar from "./MobileSideBar";

const Sidebar = async ({ children }: { children: React.ReactNode }) => {

  const user = await getCurrentUser()
  
  return (
    <div className="h-full">
        <DesktopSideBar user={user!}/>
        <MobileSideBar />
      <main className="h-full">
        {children}
    </main>
    </div>
  );
};

export default Sidebar;
