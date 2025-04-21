import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginView } from "./views/LoginView";
import { SignupView } from "./views/SignupView";
import { HomeView } from "./views/HomeView";
import { TutorialsView } from "./views/TutorialsView";
import { PortfolioView } from "./views/PortfolioView";
import { TradeView } from "./views/TradeView";
import { ContentCanvas } from "./ContentCanvas";
import { SettingsView } from "./views/SettingsView";

import { BalanceProvider } from "./BalanceContext";
import { AuthProvider } from "./AuthContext";
export const App = () => {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen select-none">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/signup" element={<SignupView />} />
            {/* balance konteksts pieejams tikai iekšā kontenta skatā, login un signup nevarēs viņu dabūt */}
            <Route
              path="/bitquest"
              element={
                <BalanceProvider>
                  <ContentCanvas />
                </BalanceProvider>
              }
            >
              <Route path={"Home"} element={<HomeView />} />
              <Route path={"Tutorials"} element={<TutorialsView />} />
              <Route path={"Portfolio"} element={<PortfolioView />} />
              <Route path={"Trade"} element={<TradeView />} />
              <Route path={"Settings"} element={<SettingsView />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};
