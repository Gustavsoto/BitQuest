import { useNavigate } from "react-router-dom";
import {
  FiBarChart,
  FiBook,
  FiBriefcase,
  FiHome,
  FiSettings,
} from "react-icons/fi";
import { ISidebarItemProps } from "../../interfaces/interfaces.props";
import { useTranslation } from "react-i18next";

export const SidebarItem = (props: ISidebarItemProps) => {
  const { title, isExpanded, onChange } = props;
  const { t } = useTranslation();
  const navigation = useNavigate();
  const changeView = (view: string) => {
    if (isExpanded && onChange != undefined) {
      onChange(false);
    }
    navigation("" + view);
  };

  const getIcon = (title: string) => {
    switch (title) {
      case "Home":
        return <FiHome className="w-8 h-8 text-gray-800 dark:text-gray-100" />;
      case "Tutorials":
        return <FiBook className="w-8 h-8 text-gray-800 dark:text-gray-100" />;
      case "Portfolio":
        return (
          <FiBriefcase className="w-8 h-8 text-gray-800 dark:text-gray-100" />
        );
      case "Trade":
        return (
          <FiBarChart className="w-8 h-8 text-gray-800 dark:text-gray-100" />
        );
      case "Settings":
        return (
          <FiSettings className="w-8 h-8 text-gray-800 dark:text-gray-100" />
        );
      default:
        return <FiHome className="w-8 h-8 text-gray-800 dark:text-gray-100" />;
    }
  };

  return (
    <div
      className={`flex ml-4 items-center transition-discrete rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-500 ${
        isExpanded ? "w-47" : "w-12"
      }`}
      onClick={() => changeView(title)}
    >
      <div className="flex items-center justify-center h-12 w-12 transition-all shrink-0">
        {getIcon(title)}
      </div>
      <div
        className={`overflow-hidden transition-all font-semibold ${
          isExpanded ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"
        }`}
      >
        {t(title)}
      </div>
    </div>
  );
};
