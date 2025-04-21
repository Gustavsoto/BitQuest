import { JSX, useState } from "react";
import { WelcomeTutorial } from "../components/Tutorials/WelcomeTutorial";
import { FeaturesTutorial } from "../components/Tutorials/FeaturesTutorial";
import { CryptoTechnologiesTutorial } from "../components/Tutorials/CryptoTechnologiesTutorial";
import { TradingTutorial } from "../components/Tutorials/TradingTutorial";
import { SecurityTutorial } from "../components/Tutorials/SecurityTutorial";

// Sānjoslas nosaukumi
const sidebarItems = [
  "Welcome to BitQuest",
  "Features of the app",
  "Basics of crypto technologies",
  "Basics of trading",
  "Security Best Practices",
];

// Atšifrējums uz komponenti
const contentMap: Record<string, JSX.Element> = {
  "Welcome to BitQuest": <WelcomeTutorial />,
  "Features of the app": <FeaturesTutorial />,
  "Basics of crypto technologies": <CryptoTechnologiesTutorial />,
  "Basics of trading": <TradingTutorial />,
  "Security Best Practices": <SecurityTutorial />,
};

export const TutorialsView = () => {
  const [selected, setSelected] = useState(sidebarItems[0]);

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900 p-4 gap-4 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 dark:bg-gray-800 rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Tutorials
        </h2>
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li
              key={item}
              onClick={() => setSelected(item)}
              className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors 
                ${
                  selected === item
                    ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6 overflow-y-auto text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-800 rounded-xl">
        {contentMap[selected]}
      </div>
    </div>
  );
};
