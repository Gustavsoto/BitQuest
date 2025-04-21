import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Lietotāja konteksts
type AuthContextType = {
  name: string;
  setName: (email: string) => void;
  surname: string;
  setSurname: (password: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  localId: string;
  setLocalId: (localId: string) => void;
  idToken: string;
  setIdToken: (idToken: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Šis ir nepieciešams lai nepazustu jau esošas vērtības pēc HOT reload vai vispar kaut kada reloada. Nolasa no sesijas esošo vērtību
  // Ja sesijā jau neglabājas tad tukša vērtība
  const [email, setEmail] = useState<string>(() => {
    const savedEmail = sessionStorage.getItem("email");
    return savedEmail ? JSON.parse(savedEmail) : "";
  });

  const [password, setPassword] = useState<string>(() => {
    const savedPassword = sessionStorage.getItem("password");
    return savedPassword ? JSON.parse(savedPassword) : "";
  });

  const [name, setName] = useState<string>(() => {
    const savedName = sessionStorage.getItem("name");
    return savedName ? JSON.parse(savedName) : "";
  });

  const [surname, setSurname] = useState<string>(() => {
    const savedSurname = sessionStorage.getItem("surname");
    return savedSurname ? JSON.parse(savedSurname) : "";
  });

  const [localId, setLocalId] = useState<string>(() => {
    const savedLocalId = sessionStorage.getItem("localId");
    return savedLocalId ? JSON.parse(savedLocalId) : "";
  });

  const [idToken, setIdToken] = useState<string>(() => {
    const savedIdToken = sessionStorage.getItem("idToken");
    return savedIdToken ? JSON.parse(savedIdToken) : "";
  });

  // Automatiski atjauno sesijas mainigos ja tie mainas

  useEffect(() => {
    sessionStorage.setItem("email", JSON.stringify(email));
  }, [email]);

  useEffect(() => {
    sessionStorage.setItem("password", JSON.stringify(password));
  }, [password]);

  useEffect(() => {
    sessionStorage.setItem("name", JSON.stringify(name));
  }, [name]);

  useEffect(() => {
    sessionStorage.setItem("surname", JSON.stringify(surname));
  }, [surname]);

  useEffect(() => {
    sessionStorage.setItem("localId", JSON.stringify(localId));
  }, [localId]);

  useEffect(() => {
    sessionStorage.setItem("idToken", JSON.stringify(idToken));
  }, [idToken]);

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        surname,
        setSurname,
        localId,
        setLocalId,
        idToken,
        setIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
