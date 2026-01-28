// Investment Comparison Hooks
export const useInvestmentComparisons = () => {
  const rates = {
    savings: 0.105, // SELIC ~10.5% a.a
    cdb: 0.105 * 0.9, // ~90% of CDI
    cdi: 0.105,
    treasury: 0.105 * 0.85, // Tesouro Selic
    bitcoin: null, // Volatile
  };

  const compareInvestments = (principal, months = 12) => {
    const monthlyRates = {
      savings: rates.savings / 12,
      cdb: rates.cdb / 12,
      cdi: rates.cdi / 12,
      treasury: rates.treasury / 12,
    };

    const calculations = {};

    Object.entries(monthlyRates).forEach(([type, rate]) => {
      const finalAmount = principal * Math.pow(1 + rate, months);
      const profit = finalAmount - principal;

      calculations[type] = {
        finalAmount: finalAmount.toFixed(2),
        profit: profit.toFixed(2),
        profitPercent: ((profit / principal) * 100).toFixed(2),
        monthlyAverage: (profit / months).toFixed(2),
      };
    });

    return calculations;
  };

  const convertCurrency = async (
    amount,
    fromCurrency = "BRL",
    toCurrency = "USD",
  ) => {
    // Mock rates
    const mockRates = {
      "BRL-USD": 0.195,
      "BRL-EUR": 0.176,
      "BRL-BTC": 0.0000055,
      "USD-BRL": 5.12,
      "EUR-BRL": 5.68,
      "BTC-BRL": 180000,
    };

    const rate = mockRates[`${fromCurrency}-${toCurrency}`];
    return {
      from: amount,
      fromCurrency,
      to: (amount * rate).toFixed(2),
      toCurrency,
      rate: rate.toFixed(6),
    };
  };

  const educationalInsights = {
    savingsTip:
      "Poupança rende todo mês automaticamente, mas é a menor rentabilidade",
    cdbTip:
      "CDB (Certificado de Depósito Bancário) rende mais que poupança e é seguro até R$ 250k",
    cdiTip:
      "CDI é a taxa referencial do mercado, a maioria dos investimentos segue ela",
    treasuryTip:
      "Títulos do Tesouro são a forma mais segura de investir no governo",
  };

  return {
    compareInvestments,
    convertCurrency,
    rates,
    educationalInsights,
  };
};
