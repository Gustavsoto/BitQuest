import { HomeNavContainer } from "../components/HomeNavContainer/HomeNavContainer";
import { CurrentPricesContainer } from "../components/CurrentPricesContainer/CurrentPricesContainer";

export const HomeView = () => {
  return (
    <div className="flex flex-col sm:flex-row flex-1 m-1 bg-gray-100 dark:bg-gray-700 overflow-hidden min-h-0">
      <div className="w-full sm:w-2/3 min-h-0 overflow-hidden p-2">
        <HomeNavContainer />
      </div>
      <div className="w-full sm:w-1/3 min-h-0 overflow-hidden p-2">
        <CurrentPricesContainer />
      </div>
    </div>
  );
};
