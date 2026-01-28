// Fiscal Module Hooks
export const useTaxCalculations = () => {
  const calculateNetSalary = (grossSalary) => {
    const gross = parseFloat(grossSalary) || 0;

    // INSS - Social contribution
    let inss = 0;
    if (gross <= 1302.0) inss = gross * 0.075;
    else if (gross <= 2571.29) inss = gross * 0.09;
    else if (gross <= 3856.94) inss = gross * 0.12;
    else inss = gross * 0.14;

    // IRRF - Personal income tax
    let irrf = 0;
    if (gross > 1903.98) {
      if (gross <= 2826.65) {
        irrf = gross * 0.075 - 142.8;
      } else if (gross <= 3751.05) {
        irrf = gross * 0.15 - 354.8;
      } else if (gross <= 4664.68) {
        irrf = gross * 0.225 - 636.13;
      } else {
        irrf = gross * 0.275 - 869.36;
      }
    }

    const net = gross - inss - irrf;
    const effectiveRate = (((inss + irrf) / gross) * 100).toFixed(1);

    return {
      gross: gross.toFixed(2),
      inss: inss.toFixed(2),
      irrf: Math.max(0, irrf).toFixed(2),
      net: net.toFixed(2),
      totalDeductions: (inss + irrf).toFixed(2),
      effectiveRate,
    };
  };

  const compareCLTvsPJ = (salary) => {
    const clt = calculateNetSalary(salary);

    // PJ typically has ~12-15% expenses (simplified)
    const pjGross = parseFloat(salary) * 0.85;
    const pjNet = pjGross * 0.91; // After ISS/IRRF ~9%

    return {
      clt: {
        ...clt,
        type: "CLT",
      },
      pj: {
        gross: pjGross.toFixed(2),
        net: pjNet.toFixed(2),
        type: "PJ",
        advantage: parseFloat(pjNet) > parseFloat(clt.net),
      },
    };
  };

  return {
    calculateNetSalary,
    compareCLTvsPJ,
  };
};

export const useDeductibles = () => {
  const categories = [
    "Saúde",
    "Educação",
    "Habitação",
    "Trabalho",
    "Livros",
    "Cursos",
  ];

  const markAsDeductible = (transaction) => {
    return {
      ...transaction,
      deductible: true,
      markedAt: new Date(),
    };
  };

  const generateDeductibleReport = (transactions) => {
    const byCategory = transactions.reduce((acc, trans) => {
      if (trans.deductible) {
        if (!acc[trans.category]) {
          acc[trans.category] = [];
        }
        acc[trans.category].push(trans);
      }
      return acc;
    }, {});

    const totals = Object.keys(byCategory).reduce((acc, cat) => {
      acc[cat] = byCategory[cat].reduce((sum, trans) => sum + trans.amount, 0);
      return acc;
    }, {});

    const totalDeductible = Object.values(totals).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    return {
      byCategory,
      totals,
      totalDeductible,
      estimatedReturn: totalDeductible * 0.15, // ~15% savings estimate
    };
  };

  return {
    categories,
    markAsDeductible,
    generateDeductibleReport,
  };
};
