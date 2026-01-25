import * as LocalAuthentication from "expo-local-authentication";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { secureStorage } from "../store/storage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkAuthSetup();
  }, []);

  const checkAuthSetup = async () => {
    try {
      const savedPin = await secureStorage.getItem("@dinero:pin");
      setHasCredentials(!!savedPin);

      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.error("Error checking auth setup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupPin = useCallback(async (pin) => {
    try {
      await secureStorage.setItem("@dinero:pin", pin);
      setHasCredentials(true);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error setting up PIN:", error);
      return false;
    }
  }, []);

  const authenticateWithPin = useCallback(async (pin) => {
    try {
      const savedPin = await secureStorage.getItem("@dinero:pin");
      if (pin === savedPin) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error authenticating with PIN:", error);
      return false;
    }
  }, []);

  const authenticateWithBiometric = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se para acessar o Dinero",
        fallbackLabel: "Usar senha",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error authenticating com biometric:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const resetAuth = useCallback(async () => {
    try {
      await secureStorage.removeItem("@dinero:pin");
      setHasCredentials(false);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error("Error resetting auth:", error);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasCredentials,
        isLoading,
        biometricAvailable,
        setupPin,
        authenticateWithPin,
        authenticateWithBiometric,
        logout,
        resetAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
