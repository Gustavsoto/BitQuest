import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ISidebarUserProps } from "../../interfaces/interfaces.props";

export const SidebarUser = (props: ISidebarUserProps) => {
  const navigation = useNavigate();
  const { title, email, isExpanded, fullName, onChange } = props;

  const changeView = (view: string) => {
    if (isExpanded && onChange != undefined) {
      onChange(false);
    }
    navigation("" + view);
  };

  return (
    <div
      className={`flex ml-4 mb-4 items-center cursor-pointer h-16 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-2xl transition-all ${
        isExpanded ? "w-47" : "w-12"
      }`}
      onClick={() => changeView(title)}
    >
      <div className="flex items-center justify-center h-12 w-12 shrink-0">
        <FiUser className="w-10 h-10 rounded-3xl border-gray-800 dark:border-gray-100 border-3" />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "opacity-100 w-auto ml-2 flex flex-col" : "opacity-0 w-0"
        }`}
      >
        <div className="text-sm font-semibold">{fullName}</div>
        <div className="text-xs text-gray-400">{email}</div>
      </div>
    </div>
  );
};
