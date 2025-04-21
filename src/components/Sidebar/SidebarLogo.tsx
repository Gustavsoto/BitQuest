import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { ISidebarItemProps } from "../../interfaces/interfaces.props";

export const SidebarLogo = (props: ISidebarItemProps) => {
  const { title, isExpanded, onChange } = props;
  const changeSidebarOpenState = (s: boolean) => {
    if (onChange != undefined) {
      onChange(s);
    }
  };
  return (
    <div
      className={`flex ml-4 items-center cursor-pointer mt-2 ${
        isExpanded ? "w-47" : "w-12"
      }`}
      onClick={() => changeSidebarOpenState(!isExpanded)}
    >
      <div className="flex items-center justify-center h-12 w-12 shrink-0">
        {isExpanded ? (
          <FiChevronsLeft className="w-8 h-8 transition-all duration-300 text-gray-800 dark:text-gray-100" />
        ) : (
          <FiChevronsRight className="w-8 h-8 transition-all duration-300 text-gray-800 dark:text-gray-100" />
        )}
      </div>
      <div
        className={`overflow-hidden transition-all font-semibold duration-300 ${
          isExpanded ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"
        }`}
      >
        {title}
      </div>
    </div>
  );
};
