import { useEffect, useState } from "react";
import { FiLogOut, FiSun, FiMoon, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api";
import { useBalance } from "../../BalanceContext";
import { useAuth } from "../../AuthContext";
import { ITopbarProps } from "../../interfaces/interfaces.props";
import i18n from "../../i18n/config";

import enFlag from "../../assets/icons/gb.svg";
import lvFlag from "../../assets/icons/lv.svg";
import { useTranslation } from "react-i18next";

export const TopBar = (props: ITopbarProps) => {
  const {
    localId,
    email,
    password,
    setName,
    setSurname,
    setEmail,
    setPassword,
    setIdToken,
    setLocalId,
  } = useAuth();
  const { balance, setBalance, setCoinData } = useBalance();
  const [isEnabled, setIsEnabled] = useState<boolean>(false); // Šis ir daily balance pievienošanas pogai
  const [loading, setLoading] = useState<boolean>(false);
  const { activeTitle } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Logout poga notīra visu kontekstu kas bija lietotājam
  const handleLogout = () => {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setIdToken("");
    setLocalId("");
    setBalance(0);
    setCoinData(undefined);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const get_balance = async () => {
      setLoading(true);
      try {
        const response: number = await invoke("get_user_balance", {
          localId: localId,
        });
        setBalance(response);
        console.log("We got the balance: " + response);
      } catch (error) {
        console.error("Error getting balance: ", error);
      } finally {
        setLoading(false);
      }
    };
    get_balance();
  }, [localId, setBalance]);

  useEffect(() => {
    const check_daily_balance = async () => {
      try {
        const response: boolean = await invoke("check_daily_balance", {
          email: email,
          password: password,
        });
        setIsEnabled(response);
      } catch (error) {
        console.error("Error checking daily balance availability: ", error);
      }
    };
    check_daily_balance();
  }, [localId, email, password]);

  const add_daily_balance = async (value: number) => {
    if (!isEnabled) {
      console.log("Daily balance is already set.");
      return;
    }

    setLoading(true);
    try {
      const response: number = await invoke("add_daily_balance", {
        email: email,
        password: password,
        value: value,
      });
      setBalance(response);
      setIsEnabled(false);
    } catch (error) {
      console.error("Error adding daily balance: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Darkmode (nezinu kāpēc nestrādā ja iznesu ārā)

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="w-full h-16 border-b-2 border-gray-500 dark:border-gray-200 bg-white text-gray-900 dark:bg-gray-800 transition-colors dark:text-gray-100 flex items-center justify-between px-4 shadow-md duration-300">
      <h1 className="text-xl font-semibold">{t(activeTitle)}</h1>
      <div className="flex items-center gap-4">
        <div className="flex justify-end p-4 space-x-2">
          <div
            className="w-12 h-12 items-center justify-center flex hover:bg-gray-200 dark:hover:bg-gray-500 rounded-2xl duration-300 cursor-pointer"
            onClick={() => changeLanguage("en")}
            title="English"
          >
            <img src={enFlag} alt="EN" className="w-8 h-8" />
          </div>
          <div
            className="w-12 h-12 items-center justify-center flex hover:bg-gray-200 dark:hover:bg-gray-500 rounded-2xl duration-300 cursor-pointer"
            onClick={() => changeLanguage("lv")}
            title="Latviski"
          >
            <img src={lvFlag} alt="LV" className="w-8 h-8" />
          </div>
        </div>
        <div className="text-xl font-semibold flex items-center mr-2">
          <div className="mr-1">
            <FiPlusCircle
              className={`w-8 h-8 ${!isEnabled ? "text-gray-400 cursor-not-allowed" : "text-blue-500 cursor-pointer"}`}
              onClick={() => {
                if (!isEnabled) return;
                add_daily_balance(10000);
              }}
            />
          </div>

          {/* Šimmeris */}
          {loading ? (
            <div className="w-24 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          ) : (
            <div className="p-1 text-center">
              {balance ? balance.toFixed(2) : 0}
            </div>
          )}
        </div>
        <div className="w-12 h-12 items-center justify-center flex hover:bg-gray-200 dark:hover:bg-gray-500 rounded-2xl duration-300">
          {darkMode ? (
            <FiMoon
              className="w-8 h-8 text-gray-800 dark:text-gray-100"
              onClick={toggleDarkMode}
            />
          ) : (
            <FiSun
              className="w-8 h-8 text-gray-800 dark:text-gray-100"
              onClick={toggleDarkMode}
            />
          )}
        </div>
        <div className="w-12 h-12 items-center justify-center flex hover:bg-gray-200 dark:hover:bg-gray-500 rounded-2xl">
          <FiLogOut onClick={handleLogout} className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};
