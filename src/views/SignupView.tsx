import { useNavigate } from "react-router-dom";
import { InputField } from "../components/BaseComponents/InputField";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { invoke } from "@tauri-apps/api";
import { AuthResult } from "../interfaces/interfaces.props";
import { useAuth } from "../AuthContext";
import { useTranslation } from "react-i18next";

export const SignupView = () => {
  const navigate = useNavigate();
  const {
    name,
    setName,
    surname,
    setSurname,
    email,
    setEmail,
    password,
    setPassword,
    setIdToken,
    setLocalId,
  } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
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

    return "An unexpected error occurred.";
  }

  const registerUser = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      console.log("this happened");
      const response = await invoke<string>("create_user", {
        email: email,
        password: password,
        name: name,
        surname: surname,
      });

      // Lietotaja konteksts uztaisits
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
      } else if (error instanceof Error) {
        errorMessage = getFriendlyErrorMessage(error.message);
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Vienu ekranu iepriekš
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
          {/* Atpakaļ poga */}
          <button
            onClick={handleBack}
            className="flex items-center font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <FiArrowLeft className="mr-2" /> {t("back")}
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerUser();
            }}
            className="flex flex-col gap-4"
          >
            <InputField
              label="name"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              label="surname"
              placeholder="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <InputField
              label="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label="password"
              placeholder="password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit" // <-- This makes Enter key submit the form
              className="p-3 rounded-xl bg-green-500 hover:bg-green-700 text-white font-medium transition flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                t("signup")
              )}
            </button>
          </form>
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </div>
        <div>{isLoading}</div>
      </div>
    </div>
  );
};
