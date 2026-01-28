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
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const response = await fetch(feedUrl, {
            signal: controller.signal,
            headers: {
              "User-Agent": "Dinero Finance App",
              Accept: "application/rss+xml, application/xml, text/xml",
            },
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const xmlText = await response.text();
          const result = parser.parse(xmlText);

          let items = [];
          if (result.rss?.channel?.item) {
            items = Array.isArray(result.rss.channel.item)
              ? result.rss.channel.item
              : [result.rss.channel.item];
          } else if (result.feed?.entry) {
            items = Array.isArray(result.feed.entry)
              ? result.feed.entry
              : [result.feed.entry];
          }

          const processedItems = items.slice(0, 10).map((item, index) => {
            // Enhanced image extraction
            let imageUrl = null;

            // Try RSS media tags first
            if (item["media:content"]?.["@_url"]) {
              imageUrl = item["media:content"]["@_url"];
            } else if (item["media:thumbnail"]?.["@_url"]) {
              imageUrl = item["media:thumbnail"]["@_url"];
            } else if (
              item.enclosure?.["@_url"] &&
              item.enclosure?.["@_type"]?.includes("image")
            ) {
              imageUrl = item.enclosure["@_url"];
            }

            // If no media tags, extract from content with improved regex
            if (!imageUrl) {
              const contentSources = [
                item["content:encoded"],
                item.description,
                item.summary,
                item.content,
              ].filter(Boolean);

              for (const content of contentSources) {
                // Try multiple image extraction patterns
                const patterns = [
                  /<img[^>]+src=["']([^"']+\.(jpg|jpeg|png|webp|gif))[^"']*["'][^>]*>/i,
                  /<img[^>]+src=["']([^"']+)["'][^>]*>/i,
                  /https?:\/\/[^\s<>"]+\.(jpg|jpeg|png|webp|gif)/i,
                  /property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
                  /name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
                ];

                for (const pattern of patterns) {
                  const match = content.match(pattern);
                  if (match && match[1]) {
                    imageUrl = match[1];
                    break;
                  }
                }
                if (imageUrl) break;
              }
            }

            // Clean and validate image URL
            if (imageUrl) {
              imageUrl = imageUrl.trim();
              // Fix relative URLs
              if (imageUrl.startsWith("//")) {
                imageUrl = "https:" + imageUrl;
              } else if (imageUrl.startsWith("/")) {
                try {
                  const baseUrl = new URL(item.link || feedUrl);
                  imageUrl = baseUrl.origin + imageUrl;
                } catch {
                  imageUrl = null;
                }
              }
              // Validate URL format
              if (imageUrl && !imageUrl.match(/^https?:\/\//)) {
                imageUrl = null;
              }
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
