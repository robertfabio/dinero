#!/usr/bin/env node
// scripts/check-coins.js
// Simple CLI to verify ExchangeRate Host (fiat) and CoinGecko (crypto) endpoints

const COIN_APIS = {
  currencies:
    "https://api.exchangerate.host/latest?base=BRL&symbols=USD,EUR,GBP",
  crypto:
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=brl&include_24hr_change=true",
};

const FETCH_TIMEOUT = 8000;

const CRYPTO_NAMES = {
  bitcoin: { symbol: "BTC", name: "Bitcoin" },
  ethereum: { symbol: "ETH", name: "Ethereum" },
  solana: { symbol: "SOL", name: "Solana" },
};

async function fetchJsonWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

function formatFiat(rates, date) {
  // exchangerate.host returns rates as: { USD: x, EUR: y, GBP: z }
  return Object.entries(rates).map(([sym, rate]) => {
    const priceBRL = rate > 0 ? 1 / rate : 0; // 1 USD = priceBRL BRL
    return {
      symbol: sym,
      priceBRL: Number(priceBRL.toFixed(6)),
      timestamp: date,
    };
  });
}

function formatCrypto(data) {
  return Object.entries(data).map(([key, value]) => ({
    symbol: CRYPTO_NAMES[key]?.symbol || key.toUpperCase(),
    name: CRYPTO_NAMES[key]?.name || key,
    priceBRL: Number((value.brl ?? 0).toFixed(6)),
    change24h:
      typeof value.brl_24h_change === "number"
        ? Number(value.brl_24h_change.toFixed(4))
        : null,
  }));
}

async function main() {
  console.log("Verificando APIs de câmbio e cripto...");
  let ok = true;

  // Fetch fiat with fallbacks
  try {
    const fiatEndpoints = [
      COIN_APIS.currencies, // exchangerate.host
      "https://api.frankfurter.app/latest?from=BRL&to=USD,EUR,GBP",
      "https://open.er-api.com/v6/latest/BRL",
    ];

    let fiat = null;
    let lastError = null;

    for (const url of fiatEndpoints) {
      try {
        const res = await fetchJsonWithTimeout(url);
        if (res && res.rates && Object.keys(res.rates).length > 0) {
          fiat = res;
          break;
        }
        lastError = new Error("Resposta sem rates");
      } catch (e) {
        lastError = e;
      }
    }

    if (!fiat)
      throw (
        lastError || new Error("Nenhuma API de fiat respondeu corretamente")
      );

    const rates = fiat.rates;
    const apiTimestamp =
      fiat.time_last_update_utc ||
      (fiat.time_last_update_unix
        ? new Date(fiat.time_last_update_unix * 1000).toISOString()
        : null) ||
      (fiat.date ? new Date(fiat.date + "T00:00:00Z").toISOString() : null) ||
      new Date().toISOString();
    const fetchedAt = new Date().toISOString();
    const formattedFiat = formatFiat(rates, apiTimestamp).map((f) => ({
      ...f,
      fetchedAt,
    }));

    console.log("\n-- FIAT --");
    formattedFiat.forEach((f) =>
      console.log(
        `${f.symbol}: ~R$ ${f.priceBRL} (api: ${f.timestamp}, fetched: ${f.fetchedAt})`,
      ),
    );
  } catch (err) {
    console.error("\nErro ao buscar FIAT:", err.message);
    ok = false;
  }

  // Fetch crypto
  try {
    const crypto = await fetchJsonWithTimeout(COIN_APIS.crypto);
    if (!crypto || typeof crypto !== "object")
      throw new Error("Resposta inválida de cripto");
    const formattedCrypto = formatCrypto(crypto);
    console.log("\n-- CRYPTO --");
    formattedCrypto.forEach((c) =>
      console.log(
        `${c.symbol} (${c.name}): R$ ${c.priceBRL} (${c.change24h ?? "n/a"}%)`,
      ),
    );
  } catch (err) {
    console.error("\nErro ao buscar CRIPTO:", err.message);
    ok = false;
  }

  if (ok) {
    console.log("\n✓ OK: todas as APIs responderam corretamente.");
    process.exit(0);
  } else {
    console.error("\n✗ Falha: verifique as mensagens acima.");
    process.exit(2);
  }
}

// Run
main().catch((err) => {
  console.error("\nErro não tratado:", err);
  process.exit(1);
});
