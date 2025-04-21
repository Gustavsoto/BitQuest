import { Outlet, useLocation } from "react-router-dom";
import { SideBar } from "./components/Sidebar/Sidebar";
import { TopBar } from "./components/Topbar/Topbar";

export const ContentCanvas = () => {
  // Šis ir galvenais logs ar visiem kontenta ekrāniem.
  const location = useLocation();
  return (
    <div
      className={`w-screen h-screen flex bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 `}
    >
      <SideBar />
      <div className="w-full ml-20 h-screen grid grid-rows-[4rem_1fr]">
        <TopBar activeTitle={location.pathname.replace("/bitquest/", "")} />
        <Outlet />
      </div>
    </div>
  );
};
