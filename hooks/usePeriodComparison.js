import { useMemo } from "react";

export function usePeriodComparison(transactions, period) {
  return useMemo(() => {
    const now = new Date();
    let currentStart = new Date();
    let previousStart = new Date();
    let previousEnd = new Date();

    if (period === "month") {
      currentStart.setDate(1);
      currentStart.setHours(0, 0, 0, 0);

      previousEnd = new Date(currentStart);
      previousEnd.setMilliseconds(-1);

      previousStart = new Date(previousEnd);
      previousStart.setDate(1);
    } else if (period === "30days") {
      currentStart.setDate(now.getDate() - 30);
      previousEnd = new Date(currentStart);
      previousEnd.setMilliseconds(-1);
      previousStart = new Date(previousEnd);
      previousStart.setDate(previousEnd.getDate() - 30);
    } else if (period === "90days") {
      currentStart.setDate(now.getDate() - 90);
      previousEnd = new Date(currentStart);
      previousEnd.setMilliseconds(-1);
      previousStart = new Date(previousEnd);
      previousStart.setDate(previousEnd.getDate() - 90);
    } else {
      return { previous: null };
    }

    const previousTransactions = transactions.filter((t) => {
      const [day, month, year] = t.date.split("/");
      const transactionDate = new Date(year, month - 1, day);
      return transactionDate >= previousStart && transactionDate <= previousEnd;
    });

    const income = previousTransactions
      .filter((t) => t.category === "income" || t.category === "salary")
      .reduce((sum, t) => sum + parseFloat(t.value || 0), 0);

    const expenses = previousTransactions
      .filter((t) => t.category !== "income" && t.category !== "salary")
      .reduce((sum, t) => sum + parseFloat(t.value || 0), 0);

    return {
      previous: {
        income,
        expenses,
        balance: income - expenses,
      },
    };
  }, [transactions, period]);
}
