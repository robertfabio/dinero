import { useCallback, useEffect, useState } from "react";

const COIN_APIS = {
  currencies: [
    "https://api.frankfurter.app/latest?from=BRL&to=USD,EUR,GBP",
    "https://open.er-api.com/v6/latest/BRL",
  ],
  crypto:
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=brl&include_24hr_change=true",
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const FETCH_TIMEOUT = 8000;

const FIAT_NAMES = {
  USD: "Dólar",
  EUR: "Euro",
  GBP: "Libra",
};

const CRYPTO_NAMES = {
  bitcoin: { symbol: "BTC", name: "Bitcoin" },
  ethereum: { symbol: "ETH", name: "Ethereum" },
  solana: { symbol: "SOL", name: "Solana" },
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const fetchJsonWithTimeout = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Falha ao buscar cotações");
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

export function useCoinData() {
  const [currencies, setCurrencies] = useState([]);
  const [crypto, setCrypto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      let data = null;
      let lastErr = null;

      for (const url of COIN_APIS.currencies) {
        try {
          const res = await fetchJsonWithTimeout(url);
          if (res && res.rates && Object.keys(res.rates).length > 0) {
            data = res;
            break;
          }
          lastErr = new Error("Resposta sem rates válidas");
        } catch (e) {
          console.warn(`Falha na API ${url}:`, e.message);
          lastErr = e;
        }
      }

      if (!data) {
        throw lastErr || new Error("Todas as APIs de câmbio falharam");
      }

      const apiTimestamp =
        data.time_last_update_utc ||
        (data.time_last_update_unix
          ? new Date(data.time_last_update_unix * 1000).toISOString()
          : null) ||
        (data.date ? new Date(data.date + "T00:00:00Z").toISOString() : null) ||
        new Date().toISOString();
      const fetchedAt = new Date().toISOString();

      const formatted = Object.entries(data.rates).map(([symbol, rate]) => {
        const price = rate > 0 ? 1 / rate : 0;
        return {
          symbol,
          name: FIAT_NAMES[symbol] || symbol,
          price: toNumber(price),
          change: null,
          timestamp: apiTimestamp,
          fetchedAt,
        };
      });

      setCurrencies(formatted);
      return formatted;
    } catch (err) {
      console.error("Erro ao buscar cotações:", err.message);
      const fallbackData = [
        {
          symbol: "USD",
          name: "Dólar",
          price: 5.5,
          change: null,
          timestamp: new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
        },
        {
          symbol: "EUR",
          name: "Euro",
          price: 6.2,
          change: null,
          timestamp: new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
        },
        {
          symbol: "GBP",
          name: "Libra",
          price: 7.1,
          change: null,
          timestamp: new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
        },
      ];
      setCurrencies(fallbackData);
    }
  }, []);

  const fetchCrypto = useCallback(async () => {
    try {
      const data = await fetchJsonWithTimeout(COIN_APIS.crypto);

      const fetchedAt = new Date().toISOString();
      const formatted = Object.entries(data).map(([key, value]) => ({
        symbol: CRYPTO_NAMES[key]?.symbol || key.toUpperCase(),
        name: CRYPTO_NAMES[key]?.name || key,
        price: toNumber(value.brl),
        change: toNumber(value.brl_24h_change),
        timestamp: fetchedAt,
        fetchedAt,
      }));

      setCrypto(formatted);
      return formatted;
    } catch (err) {
      console.error("Erro ao buscar criptomoedas:", err.message);
      const fallbackData = [
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: 470000,
          change: null,
          timestamp: new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          price: 15500,
          change: null,
          timestamp: new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
        },
        {
          symbol: "SOL",
          name: "Solana",
          price: 670,
          change: null,
          timestamp: new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
        },
      ];
      setCrypto(fallbackData);
      throw err;
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

    const interval = setInterval(refresh, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [refresh]);

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
