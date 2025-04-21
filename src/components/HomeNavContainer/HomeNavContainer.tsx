import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useTranslation } from "react-i18next";

export const HomeNavContainer = () => {
  const { name } = useAuth();

  const navigation = useNavigate();
  const { t } = useTranslation();
  const cards = [
    {
      title: t("learn_tutorials"),
      image: "📘",
      path: "/bitquest/tutorials",
    },
    {
      title: t("check_portfolio"),
      image: "💰",
      path: "/bitquest/portfolio",
    },
    {
      title: t("practice_trading"),
      image: "📈",
      path: "/bitquest/trade",
    },
    {
      title: t("change_settings"),
      image: "⚙️",
      path: "/bitquest/settings",
    },
  ];
  return (
    <div className="flex flex-col w-full h-full items-center justify-center flex-4 bg-gray-200 dark:bg-gray-800 rounded-xl p-6 overflow-hidden">
      <h1 className="text-2xl font-bold mb-2">
        {t("welcome_back")}, {name}!
      </h1>
      <p className="text-gray-600 dark:text-gray-200 mb-6">
        {t("continue_message")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl overflow-y-auto overflow-x-hidden rounded-2xl p-4">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigation(card.path)}
            className="flex flex-col items-center justify-between bg-white dark:bg-gray-700 rounded-2xl shadow-md p-4 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-center bg-gray-300 dark:bg-gray-800 w-full h-40 rounded-xl text-5xl">
              {card.image}
            </div>

            <div className="mt-4 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
              {card.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
