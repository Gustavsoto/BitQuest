import { useState } from "react";
import { WelcomeTutorial } from "../components/Tutorials/WelcomeTutorial";
import { FeaturesTutorial } from "../components/Tutorials/FeaturesTutorial";
import { CryptoTechnologiesTutorial } from "../components/Tutorials/CryptoTechnologiesTutorial";
import { TradingTutorial } from "../components/Tutorials/TradingTutorial";
import { SecurityTutorial } from "../components/Tutorials/SecurityTutorial";
import { useTranslation } from "react-i18next";

export const TutorialsView = () => {
  const { t } = useTranslation();

  // Pamācību moduļa navigācijas joslas opcijas
  const sidebarKeys = [
    "tutorial_view_option_1",
    "tutorial_view_option_2",
    "tutorial_view_option_3",
    "tutorial_view_option_4",
    "tutorial_view_option_5",
  ];

  // Aktīvā pamācība vai izglītojošā materiāla atslēga
  const [selectedKey, setSelectedKey] = useState(sidebarKeys[0]);

  const renderSelectedTutorial = () => {
    switch (selectedKey) {
      case "tutorial_view_option_1":
        return <WelcomeTutorial />;
      case "tutorial_view_option_2":
        return <FeaturesTutorial />;
      case "tutorial_view_option_3":
        return <CryptoTechnologiesTutorial />;
      case "tutorial_view_option_4":
        return <TradingTutorial />;
      case "tutorial_view_option_5":
        return <SecurityTutorial />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900 p-4 gap-4 overflow-hidden">
      {/* Pamācību navigācijas josla */}
      <div className="w-64 bg-gray-200 dark:bg-gray-800 rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {t("Tutorials")}
        </h2>
        <ul className="space-y-2">
          {sidebarKeys.map((key) => (
            <li
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors 
                ${
                  selectedKey === key
                    ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
      {/* Saturs kas tiek attēlots */}
      <div className="flex-1 p-6 overflow-y-auto text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-800 rounded-xl">
        {renderSelectedTutorial()}
      </div>
    </div>
  );
};
