// no React hooks needed in this utility hook

export const useFuelCalculations = () => {
  const calculateBestFuel = (gasolinePrice, ethanolPrice) => {
    const ratio = ethanolPrice / gasolinePrice;
    const worthEthanol = ratio <= 0.7;

    const gasolineConsumption = 10;
    const ethanolConsumption = 13;

    const gasolineCost = gasolinePrice * gasolineConsumption;
    const ethanolCost = ethanolPrice * ethanolConsumption;

    const savings100km = worthEthanol
      ? (gasolineCost - ethanolCost).toFixed(2)
      : (ethanolCost - gasolineCost).toFixed(2);

    return {
      worthEthanol,
      ratio: (ratio * 100).toFixed(1),
      savings100km,
      recommendation: worthEthanol ? "ethanol" : "gasoline",
    };
  };

  const calculateFuelEfficiency = (distance, consumption, price) => {
    const litersUsed = distance / consumption;
    const totalCost = litersUsed * price;

    return {
      litersUsed: litersUsed.toFixed(2),
      totalCost: totalCost.toFixed(2),
      costPerKm: (totalCost / distance).toFixed(3),
    };
  };

  const compareFuelCosts = (distance, gasolinePrice, ethanolPrice) => {
    const gasolineEfficiency = 12;
    const ethanolEfficiency = 8.5;

    const gasoline = calculateFuelEfficiency(
      distance,
      gasolineEfficiency,
      gasolinePrice,
    );
    const ethanol = calculateFuelEfficiency(
      distance,
      ethanolEfficiency,
      ethanolPrice,
    );

    const bestOption =
      parseFloat(gasoline.totalCost) < parseFloat(ethanol.totalCost)
        ? "gasoline"
        : "ethanol";
    const savings = Math.abs(
      parseFloat(gasoline.totalCost) - parseFloat(ethanol.totalCost),
    ).toFixed(2);

    return {
      gasoline,
      ethanol,
      bestOption,
      savings,
    };
  };

  return {
    calculateBestFuel,
    calculateFuelEfficiency,
    compareFuelCosts,
  };
};
