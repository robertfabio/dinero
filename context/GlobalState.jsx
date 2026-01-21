import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const DineroContext = createContext();

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getASyncStorage = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem(
          "@dinero:transactions",
        );
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.log("Error retrieving data from AsyncStorage:", error);
      }
    };
    getASyncStorage();
  }, []);
  return (
    <DineroContext.Provider value={[transactions, setTransactions]}>
      {children}
    </DineroContext.Provider>
  );
}
