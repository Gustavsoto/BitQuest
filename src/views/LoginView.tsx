import { useNavigate } from "react-router-dom";
import { InputField } from "../components/BaseComponents/InputField";
import { useState } from "react";
import { invoke } from "@tauri-apps/api";
import { AuthResult } from "../interfaces/interfaces.props";
import { useAuth } from "../AuthContext";
import { useTranslation } from "react-i18next";

export const LoginView = () => {
  const navigate = useNavigate();
  const {
    name,
    password,
    setLocalId,
    setIdToken,
    setEmail,
    setPassword,
    setName,
    setSurname,
  } = useAuth();

  const { t } = useTranslation();

  function getFriendlyErrorMessage(error: string): string {
    if (error.startsWith("SignIn(")) {
      return "Login failed. Please check your email and password.";
    }
    if (error.startsWith("SignUp(")) {
      return "Sign-up failed. Please try again later.";
    }
    if (error.startsWith("User(")) {
      return "Could not fetch user data.";
    }
    if (error.startsWith("Token(")) {
      return "Session token error. Please log in again.";
    }
    if (error.startsWith("API(")) {
      return "Something went wrong with the server. Please try again.";
    }

    return error;
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signUp = async () => {
    navigate("/signup");
  };

  const getUserData = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await invoke<string>("authenticate_user", {
        email: username,
        password: password,
      });

      const result: AuthResult = JSON.parse(response);
      setName(result.userInfo.name);
      setSurname(result.userInfo.lastname);
      setEmail(result.userInfo.email);
      setPassword(result.userInfo.password);
      setIdToken(result.idToken);
      setLocalId(result.localId);

      if (result.userInfo) {
        navigate("/bitquest/Home");
      }
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (typeof error === "string") {
        errorMessage = getFriendlyErrorMessage(error);
        console.log(error);
      } else if (error instanceof Error) {
        errorMessage = getFriendlyErrorMessage(error.message);
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        "w-screen h-screen flex bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
      }
    >
      <h1 className="hidden lg:flex text-3xl font-bold flex-2 bg-gray-100 dark:bg-gray-800 items-center justify-center">
        BitQuest
      </h1>

      <div className="w-150 h-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center flex-1 lg:flex-none min-h-[700px] overflow-y-auto">
        <div className="w-full max-w-md h-max bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center">BitQuest</h2>

          <InputField
            label="email"
            placeholder="email"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            label="password"
            placeholder="password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="h-px bg-gray-400 dark:bg-gray-700 w-full" />

          <button
            className="p-3 rounded-xl bg-green-500 hover:bg-green-700 text-white font-medium transition flex items-center justify-center gap-2"
            onClick={() => getUserData(name, password)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("loading")}...
              </>
            ) : (
              t("login")
            )}
          </button>

          <button
            className="p-3 rounded-xl bg-red-500 hover:bg-red-700 text-white font-medium transition"
            onClick={signUp}
            disabled={isLoading}
          >
            {t("signup")}
          </button>
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};
