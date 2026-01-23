import { useCallback, useEffect, useState } from "react";

// APIs públicas de cotação
const COIN_APIS = {
  // AwesomeAPI - Cotações de moedas (grátis, sem auth)
  currencies:
    "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL,GBP-BRL",
  // API alternativa para criptomoedas
  crypto:
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=brl&include_24hr_change=true",
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useCoinData() {
  const [currencies, setCurrencies] = useState([]);
  const [crypto, setCrypto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await fetch(COIN_APIS.currencies);
      if (!response.ok) throw new Error("Falha ao buscar cotações");

      const data = await response.json();

      const formatted = Object.values(data).map((coin) => ({
        symbol: coin.code,
        name: coin.name,
        price: parseFloat(coin.bid),
        change: parseFloat(coin.pctChange),
        high: parseFloat(coin.high),
        low: parseFloat(coin.low),
        timestamp: coin.create_date,
      }));

      setCurrencies(formatted);
      return formatted;
    } catch (err) {
      console.warn("Erro ao buscar moedas:", err);
      // Fallback com dados mock
      setCurrencies([
        { symbol: "USD", name: "Dólar", price: 5.89, change: 0.32 },
        { symbol: "EUR", name: "Euro", price: 6.42, change: -0.15 },
        { symbol: "GBP", name: "Libra", price: 7.45, change: 0.08 },
      ]);
      return [];
    }
  }, []);

  const fetchCrypto = useCallback(async () => {
    try {
      const response = await fetch(COIN_APIS.crypto);
      if (!response.ok) throw new Error("Falha ao buscar criptomoedas");

      const data = await response.json();

      const cryptoNames = {
        bitcoin: { symbol: "BTC", name: "Bitcoin" },
        ethereum: { symbol: "ETH", name: "Ethereum" },
        solana: { symbol: "SOL", name: "Solana" },
      };

      const formatted = Object.entries(data).map(([key, value]) => ({
        symbol: cryptoNames[key]?.symbol || key.toUpperCase(),
        name: cryptoNames[key]?.name || key,
        price: value.brl,
        change: value.brl_24h_change || 0,
      }));

      setCrypto(formatted);
      return formatted;
    } catch (err) {
      console.warn("Erro ao buscar cripto:", err);
      // Fallback com dados mock
      setCrypto([
        { symbol: "BTC", name: "Bitcoin", price: 589000, change: 2.45 },
        { symbol: "ETH", name: "Ethereum", price: 18500, change: -1.2 },
      ]);
      return [];
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchCurrencies(), fetchCrypto()]);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchCurrencies, fetchCrypto]);

  useEffect(() => {
    refresh();

    // Auto-refresh a cada 5 minutos
    const interval = setInterval(refresh, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [refresh]);

  // Combina moedas e cripto em um único array para exibição
  const allCoins = [...currencies, ...crypto];

  return {
    currencies,
    crypto,
    allCoins,
    loading,
    error,
    lastUpdate,
    refresh,
  };
}
