import { useCallback, useEffect, useState } from "react";
import { storageUtils } from "../store/storage";

const WISHLIST_KEY = "@dinero:wishlist";

// Produtos de exemplo (futuramente serão puxados de uma API com links de afiliado)
const SAMPLE_DEALS = [
  {
    id: "1",
    title: "Curso: Investimentos para Iniciantes",
    description: "Aprenda a investir do zero com estratégias práticas",
    originalPrice: 297,
    price: 47,
    discount: 84,
    category: "educacao",
    image: "📚",
    affiliateUrl: "https://example.com/curso-investimentos",
  },
  {
    id: "2",
    title: "Planilha Controle Financeiro PRO",
    description: "Organize suas finanças com planilhas automatizadas",
    originalPrice: 97,
    price: 27,
    discount: 72,
    category: "ferramentas",
    image: "📊",
    affiliateUrl: "https://example.com/planilha-pro",
  },
  {
    id: "3",
    title: "E-book: Liberdade Financeira",
    description: "Guia completo para conquistar sua independência",
    originalPrice: 49,
    price: 19,
    discount: 61,
    category: "educacao",
    image: "📖",
    affiliateUrl: "https://example.com/ebook-liberdade",
  },
  {
    id: "4",
    title: "App Premium de Investimentos",
    description: "1 ano de acesso a ferramentas avançadas de análise",
    originalPrice: 199,
    price: 99,
    discount: 50,
    category: "apps",
    image: "📱",
    affiliateUrl: "https://example.com/app-premium",
  },
  {
    id: "5",
    title: "Mentoria Individual - 1 mês",
    description: "Acompanhamento personalizado com especialista",
    originalPrice: 997,
    price: 497,
    discount: 50,
    category: "mentoria",
    image: "🎯",
    affiliateUrl: "https://example.com/mentoria",
  },
];

export function useMarketDeals() {
  const [deals, setDeals] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega wishlist do storage
  const loadWishlist = useCallback(async () => {
    try {
      const saved = storageUtils.getItem(WISHLIST_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (err) {
      console.warn("Erro ao carregar wishlist:", err);
    }
  }, []);

  // Salva wishlist no storage
  const saveWishlist = useCallback(async (items) => {
    try {
      storageUtils.setItem(WISHLIST_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("Erro ao salvar wishlist:", err);
    }
  }, []);

  // Adiciona item à wishlist
  const addToWishlist = useCallback(
    (item) => {
      setWishlist((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        if (exists) return prev;
        const updated = [
          ...prev,
          { ...item, addedAt: new Date().toISOString() },
        ];
        saveWishlist(updated);
        return updated;
      });
    },
    [saveWishlist],
  );

  // Remove item da wishlist
  const removeFromWishlist = useCallback(
    (itemId) => {
      setWishlist((prev) => {
        const updated = prev.filter((i) => i.id !== itemId);
        saveWishlist(updated);
        return updated;
      });
    },
    [saveWishlist],
  );

  // Adiciona link customizado do usuário
  const addCustomLink = useCallback(
    (title, url, description = "") => {
      const newItem = {
        id: `custom-${Date.now()}`,
        title,
        description,
        url,
        isCustom: true,
        addedAt: new Date().toISOString(),
      };

      setWishlist((prev) => {
        const updated = [...prev, newItem];
        saveWishlist(updated);
        return updated;
      });

      return newItem;
    },
    [saveWishlist],
  );

  // Verifica se item está na wishlist
  const isInWishlist = useCallback(
    (itemId) => {
      return wishlist.some((i) => i.id === itemId);
    },
    [wishlist],
  );

  // Busca deals (futuramente será uma API)
  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Substituir por chamada à API real com links de afiliado
      // const response = await fetch('SUA_API_DE_AFILIADOS');
      // const data = await response.json();

      setDeals(SAMPLE_DEALS);
    } catch (err) {
      setError(err.message);
      console.warn("Erro ao buscar deals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh
  const refresh = useCallback(async () => {
    await Promise.all([fetchDeals(), loadWishlist()]);
  }, [fetchDeals, loadWishlist]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Separa itens customizados dos deals de afiliado
  const customLinks = wishlist.filter((item) => item.isCustom);
  const savedDeals = wishlist.filter((item) => !item.isCustom);

  return {
    deals,
    wishlist,
    customLinks,
    savedDeals,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    addCustomLink,
    isInWishlist,
    refresh,
  };
}
