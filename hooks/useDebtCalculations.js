// Debt Management Hooks
export const useDebtCalculations = () => {
  const calculateMonthlyCommitment = (parcels) => {
    return parcels.reduce((sum, parcel) => {
      const monthsRemaining = parcel.monthsRemaining || 12;
      return sum + parcel.amount / monthsRemaining;
    }, 0);
  };

  const calculateInstallmentAdvance = (
    amount,
    discountPercent,
    cdiRate = 0.105,
  ) => {
    const monthlyRate = cdiRate / 12;
    const discountAmount = amount * (discountPercent / 100);
    const discountedValue = amount - discountAmount;
    const futureValue = amount * (1 + monthlyRate);
    const gainIfWait = futureValue - amount;

    return {
      original: amount.toFixed(2),
      discounted: discountedValue.toFixed(2),
      saved: discountAmount.toFixed(2),
      futureValue: futureValue.toFixed(2),
      gainIfWait: gainIfWait.toFixed(2),
      worthAdvancing: discountAmount > gainIfWait,
    };
  };

  const projectDebt = (amount, months, monthlyPayment) => {
    const monthlyRate = 0.02; // ~24% yearly (credit card average)
    let remaining = amount;
    const schedule = [];

    for (let i = 0; i < months; i++) {
      const interest = remaining * monthlyRate;
      const principal = monthlyPayment - interest;
      remaining -= principal;

      schedule.push({
        month: i + 1,
        payment: monthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: Math.max(0, remaining).toFixed(2),
      });

      if (remaining <= 0) break;
    }

    return {
      schedule,
      totalPaid: schedule.reduce((sum, s) => sum + parseFloat(s.payment), 0),
      totalInterest: schedule.reduce(
        (sum, s) => sum + parseFloat(s.interest),
        0,
      ),
    };
  };

  return {
    calculateMonthlyCommitment,
    calculateInstallmentAdvance,
    projectDebt,
  };
};

export const useCardOptimization = () => {
  const findBestPaymentStrategy = (debt, availableFunds) => {
    const strategies = {
      avalanche: {
        name: "Avalanche",
        description: "Pagar as dívidas com maior juros primeiro",
        order: (debts) => [...debts].sort((a, b) => b.rate - a.rate),
      },
      snowball: {
        name: "Snowball",
        description: "Pagar as menores dívidas primeiro",
        order: (debts) => [...debts].sort((a, b) => a.amount - b.amount),
      },
    };

    return strategies;
  };

  return {
    findBestPaymentStrategy,
  };
};
