// Vehicle Management Hooks
export const useFuelCalculations = () => {
  const calculateBestFuel = (gasPrice, ethanolPrice) => {
    // Rule of 70%: Ethanol is worth it if price ≤ 70% of gas
    const threshold = gasPrice * 0.7;
    const worthEthanol = ethanolPrice <= threshold;
    const ratio = (ethanolPrice / gasPrice) * 100;

    // Assuming 12 L/100km for gas, 9 L/100km for ethanol
    const gasConsumption = 12;
    const ethanolConsumption = 9;

    const gasCost100km = (gasPrice * gasConsumption).toFixed(2);
    const ethanolCost100km = (ethanolPrice * ethanolConsumption).toFixed(2);

    return {
      gasPrice: gasPrice.toFixed(2),
      ethanolPrice: ethanolPrice.toFixed(2),
      ratio: ratio.toFixed(1),
      threshold: threshold.toFixed(2),
      worthEthanol,
      gasCost100km,
      ethanolCost100km,
      savings100km:
        worthEthanol && gasCost100km > ethanolCost100km
          ? (gasCost100km - ethanolCost100km).toFixed(2)
          : "0.00",
    };
  };

  return {
    calculateBestFuel,
  };
};

export const useFipeData = () => {
  const mockFipeDatabase = {
    "Hyundai HB20 2022": 65800,
    "Volkswagen Gol 2022": 58900,
    "Fiat Mobi 2021": 52000,
    "Toyota Corolla 2022": 128500,
    "Honda Civic 2021": 145000,
  };

  const getFipeValue = async (brand, model, year) => {
    // In a real app, this would call the FIPE API
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = `${brand} ${model} ${year}`;
        resolve(mockFipeDatabase[key] || null);
      }, 1200);
    });
  };

  const trackVehicleValuation = (
    vehicleId,
    purchasePrice,
    currentFipeValue,
  ) => {
    const change = currentFipeValue - purchasePrice;
    const percentChange = ((change / purchasePrice) * 100).toFixed(2);

    return {
      purchasePrice: purchasePrice.toFixed(2),
      currentValue: currentFipeValue.toFixed(2),
      change: change.toFixed(2),
      percentChange,
      isAppreciating: change > 0,
    };
  };

  return {
    getFipeValue,
    trackVehicleValuation,
    mockFipeDatabase,
  };
};
