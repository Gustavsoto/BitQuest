import { JSX, useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarUser } from "./SidebarUser";
import { useAuth } from "../../AuthContext";

export const SideBar = (): JSX.Element => {
  const [expandedView, setExpandedView] = useState<boolean>(false);
  const { name, surname, email } = useAuth();
  return (
    <aside
      className={`h-screen bg-white dark:bg-gray-800 flex z-40 flex-col transition-all border-r-2 border-gray-500 dark:border-gray-200 duration-300 ${
        expandedView ? "w-55" : "w-20"
      } fixed left-0 top-0`}
    >
      <SidebarLogo
        title={"BitQuest"}
        isExpanded={expandedView}
        onChange={setExpandedView}
      />
      <div className="flex-grow space-y-2 mt-2">
        <SidebarItem
          title="Home"
          isExpanded={expandedView}
          onChange={setExpandedView}
        />
        <SidebarItem
          title="Tutorials"
          isExpanded={expandedView}
          onChange={setExpandedView}
        />
        <SidebarItem
          title="Trade"
          isExpanded={expandedView}
          onChange={setExpandedView}
        />
        <SidebarItem
          title="Portfolio"
          isExpanded={expandedView}
          onChange={setExpandedView}
        />
      </div>
      <div>
        <SidebarUser
          fullName={name + " " + surname}
          title="Settings"
          email={email}
          onChange={setExpandedView}
          isExpanded={expandedView}
        />
      </div>
    </aside>
  );
};
