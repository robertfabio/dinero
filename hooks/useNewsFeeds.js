import { XMLParser } from "fast-xml-parser";
import { useEffect, useState } from "react";

const RSS_FEEDS = [
  "https://www.infomoney.com.br/feed/",
  "https://br.investing.com/rss/news.rss",
  "https://exame.com/feed/",
  "http://rss.uol.com.br/feed/economia.xml",
  // TODO: add Valor, G1, Estadão, Reuters feeds after validating stable RSS endpoints
];

export function useNewsFeeds() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });

      const allNews = [];

      for (const feedUrl of RSS_FEEDS) {
        try {
          const response = await fetch(feedUrl, {
            headers: {
              "User-Agent": "Dinero Finance App",
            },
          });
          const xmlText = await response.text();
          const result = parser.parse(xmlText);

          let items = [];
          if (result.rss?.channel?.item) {
            items = Array.isArray(result.rss.channel.item)
              ? result.rss.channel.item
              : [result.rss.channel.item];
          } else if (result.feed?.entry) {
            // Atom feed
            items = Array.isArray(result.feed.entry)
              ? result.feed.entry
              : [result.feed.entry];
          }

          const processedItems = items.slice(0, 10).map((item, index) => {
            // Extract image
            let imageUrl = null;
            if (item["media:content"]?.["@_url"]) {
              imageUrl = item["media:content"]["@_url"];
            } else if (item["media:thumbnail"]?.["@_url"]) {
              imageUrl = item["media:thumbnail"]["@_url"];
            } else if (item.enclosure?.["@_url"]) {
              imageUrl = item.enclosure["@_url"];
            } else if (item["content:encoded"]) {
              const imgMatch = item["content:encoded"].match(
                /<img[^>]+src="([^">]+)"/,
              );
              if (imgMatch) imageUrl = imgMatch[1];
            } else if (item.description) {
              const imgMatch = item.description.match(
                /<img[^>]+src="([^">]+)"/,
              );
              if (imgMatch) imageUrl = imgMatch[1];
            }

            return {
              id: `${feedUrl}-${index}`,
              title: item.title || item.title?.["#text"] || "Sem título",
              description:
                item.description?.replace(/<[^>]*>/g, "").substring(0, 150) ||
                item.summary?.replace(/<[^>]*>/g, "").substring(0, 150) ||
                "",
              link: item.link?.["@_href"] || item.link || item.guid || "#",
              imageUrl,
              pubDate:
                item.pubDate || item.published || new Date().toISOString(),
              source: (() => {
                if (feedUrl.includes("infomoney")) return "InfoMoney";
                if (feedUrl.includes("investing.com")) return "Investing.com";
                if (feedUrl.includes("exame.com")) return "Exame";
                if (
                  feedUrl.includes("uol.com.br") ||
                  feedUrl.includes("rss.uol.com.br")
                )
                  return "UOL";
                try {
                  return new URL(feedUrl).hostname.replace(/^www\./, "");
                } catch {
                  return feedUrl;
                }
              })(),
            };
          });

          allNews.push(...processedItems);
        } catch (feedError) {
          console.error(`Error fetching feed ${feedUrl}:`, feedError);
        }
      }

      // Sort by date
      allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      setNews(allNews.slice(0, 20)); // Max 20 news
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { news, loading, error, refresh: fetchNews };
}
