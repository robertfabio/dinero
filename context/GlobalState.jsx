import { createContext, useEffect, useState } from "react";
import { storageUtils } from "../utils/storage";

export const DineroContext = createContext();

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getStoredData = () => {
      try {
        const storedTransactions = storageUtils.getItem("@dinero:transactions");
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.log("Error retrieving data from storage:", error);
      }
    };
    getStoredData();
  }, []);

  return (
    <DineroContext.Provider value={[transactions, setTransactions]}>
      {children}
    </DineroContext.Provider>
  );
}
