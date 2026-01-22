import { createContext, useContext, useRef } from "react";

const SummaryActionContext = createContext(null);

export function SummaryActionProvider({ children }) {
  const shareActionRef = useRef(null);

  return (
    <SummaryActionContext.Provider value={shareActionRef}>
      {children}
    </SummaryActionContext.Provider>
  );
}

export function useSummaryAction() {
  return useContext(SummaryActionContext);
}
