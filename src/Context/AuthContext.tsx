import { useRouter, useSegments } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  deleteToken,
  getToken,
  save,
} from "@/libraries/Secure Store/expoSecureStore";

interface AuthContextType {
  authToken: string | null;
  updateAuthToken: (newToken: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

  //if authenticated load the token from expo secure store
  useEffect(() => {
    const loadAuthToken = async () => {
      const res = await getToken();

      if (res) {
        setAuthToken(res);
      }
    };
    loadAuthToken();
  }, []);

  //checking if the user is authenticated
  useEffect(() => {
    const isAuthGroup = segments[0] === "(auth)";
    if (!authToken && !isAuthGroup) {
      router.replace("/login/");
    }
    if (authToken && isAuthGroup) {
      router.replace("/");
    }
  }, [segments, authToken]);

  //update auth token if the user is logging in
  const updateAuthToken = async (newToken: string | null) => {
    if (newToken) {
      await save(newToken);
    } else {
      await deleteToken();
    }
    setAuthToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ authToken, updateAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

//helper to useAuth in the request
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
