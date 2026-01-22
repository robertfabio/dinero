import { useMemo } from "react";

export function useSummaryData(transactions, period = "all") {
  return useMemo(() => {
    let filteredTransactions = transactions;

    if (period !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      if (period === "month") {
        cutoffDate.setDate(1);
        cutoffDate.setHours(0, 0, 0, 0);
      } else if (period === "30days") {
        cutoffDate.setDate(now.getDate() - 30);
      } else if (period === "90days") {
        cutoffDate.setDate(now.getDate() - 90);
      }

      filteredTransactions = transactions.filter((t) => {
        const [day, month, year] = t.date.split("/");
        const transactionDate = new Date(year, month - 1, day);
        return transactionDate >= cutoffDate;
      });
    }

    const income = filteredTransactions
      .filter((t) => t.category === "income" || t.category === "salary")
      .reduce((sum, t) => sum + parseFloat(t.value || 0), 0);

    const expenses = filteredTransactions
      .filter((t) => t.category !== "income" && t.category !== "salary")
      .reduce((sum, t) => sum + parseFloat(t.value || 0), 0);

    const balance = income - expenses;

    const categoryData = {};
    filteredTransactions.forEach((t) => {
      if (t.category !== "income" && t.category !== "salary") {
        if (!categoryData[t.category]) {
          categoryData[t.category] = 0;
        }
        categoryData[t.category] += parseFloat(t.value || 0);
      }
    });

    const avgTransaction =
      filteredTransactions.length > 0
        ? filteredTransactions.reduce(
            (sum, t) => sum + parseFloat(t.value || 0),
            0,
          ) / filteredTransactions.length
        : 0;

    const largestExpense = Math.max(
      ...filteredTransactions
        .filter((t) => t.category !== "income" && t.category !== "salary")
        .map((t) => parseFloat(t.value || 0)),
      0,
    );

    const chartData = Object.entries(categoryData).map(
      ([cat, value], index) => {
        const colors = [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
        ];
        return {
          name: cat,
          population: value,
          color: colors[index % colors.length],
          legendFontColor: "#4B4B4B",
          legendFontSize: 13,
        };
      },
    );

    return {
      income,
      expenses,
      balance,
      categoryData,
      chartData,
      avgTransaction,
      largestExpense,
      transactionCount: filteredTransactions.length,
    };
  }, [transactions, period]);
}
