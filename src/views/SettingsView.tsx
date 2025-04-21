import { useState } from "react";
import { InputField } from "../components/BaseComponents/InputField";
import { AuthResult } from "../interfaces/interfaces.props";
import { invoke } from "@tauri-apps/api";
import { useAuth } from "../AuthContext";
import { useTranslation } from "react-i18next";

export const SettingsView = () => {
  const {
    name,
    setName,
    surname,
    setSurname,
    email,
    setEmail,
    password,
    setPassword,
  } = useAuth();
  const [tempName, setTempName] = useState<string>(name);
  const [tempSurname, setTempSurname] = useState<string>(surname);
  const [tempEmail, setTempEmail] = useState<string>(email);
  const [tempPassword, setTempPassword] = useState<string>(password);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
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

  // Kontrolē vai ir iespējams rediģēt laukus vei nē
  const [isEditable, setIsEditable] = useState<boolean>(false);

  // Nosūta uz firebase vai ari enablo editošanu
  const handleEditToggle = () => {
    if (isEditable) {
      updateUserInfo(tempName, tempSurname, tempEmail, tempPassword);
    } else {
      setIsEditable(!isEditable);
    }
  };

  const handleCancel = () => {
    setTempName(name);
    setTempSurname(surname);
    setTempEmail(email);
    setTempPassword(password);
    setIsEditable(false);
  };

  const updateUserInfo = async (
    name: string,
    surname: string,
    email: string,
    password: string
  ) => {
    try {
      setIsEditable(false);
      setErrorMessage(""); // Notīra vecos errorus
      const response = await invoke<string>("save_user", {
        email: email,
        password: password,
        name: name,
        surname: surname,
      });
      const result: AuthResult = JSON.parse(response);

      if (result.userInfo) {
        setName(result.userInfo.name);
        setSurname(result.userInfo.lastname);
        setEmail(result.userInfo.email);
        setPassword(result.userInfo.password);
        setIsEditable(false);
      }
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred: " + error;

      if (typeof error === "string") {
        errorMessage = getFriendlyErrorMessage(error);
      } else if (error instanceof Error) {
        errorMessage = getFriendlyErrorMessage(error.message);
      }
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-700 p-4">
      <main className="flex-1 p-8 overflow-y-auto bg-gray-200 dark:bg-gray-800 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {t("profile_title")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="name"
            placeholder="Name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            disabled={!isEditable}
          />
          <InputField
            label="surname"
            placeholder="Last name"
            value={tempSurname}
            onChange={(e) => setTempSurname(e.target.value)}
            disabled={!isEditable}
          />
          <InputField
            label="email"
            placeholder="Email"
            value={tempEmail}
            onChange={(e) => setTempEmail(e.target.value)}
            disabled={!isEditable}
          />
          <InputField
            type="password"
            label="password"
            placeholder="Password"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            disabled={!isEditable}
          />

          {/* Pogas */}
          <div className="md:col-span-2 mt-4 flex items-center gap-3">
            {isEditable ? (
              <>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
                  onClick={handleEditToggle}
                >
                  {t("save_changes")}
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                  onClick={handleCancel}
                >
                  {t("cancel")}
                </button>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
                onClick={handleEditToggle}
              >
                {t("edit")}
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </div>
      </main>
    </div>
  );
};
