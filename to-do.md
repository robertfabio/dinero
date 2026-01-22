1. Serviço de Inteligência (AI Gateway)
O objetivo aqui é centralizar a lógica de IA para controlar custos e trocar de provedor (Groq, Gemini, OpenAI) sem atualizar o app.

Endpoint: /ai/categorize

Input: String da transação (ex: "Pgto Mcdonalds 32,90").

Lógica: Verifica no Redis se "Mcdonalds" já tem categoria. Se não, chama a API da Groq/Gemini Flash com um prompt curto de classificação. Salva o resultado no Redis.

Retorno: JSON { "category": "Alimentação", "icon": "burger" }.

Tech: Go http.Client com timeout agressivo + Redis (ou cache em memória go-cache).

Endpoint: /ai/advisor

Input: JSON anônimo com totais mensais (ex: { "alimentacao": 500, "renda": 2000 }).

Lógica: Monta um prompt estruturado ("Atue como economista..."). Envia para LLM.

Otimização: Usa Semantic Caching. Se outro usuário com perfil idêntico perguntar, retorna a mesma dica.

2. Engine de Promoções & Afiliados (Money Maker)
Este é o coração da monetização. O Go deve trabalhar em background (Goroutines).

Worker: PromoScraper (Background Job)

Funcionalidade: Um loop infinito (ou Cron) que lê mensagens de canais (Telegram API é a mais fácil de automatizar em Go) ou RSS de sites de ofertas.

Filtro: Ignora spam e pega apenas produtos eletrônicos/relevantes usando Regex ou IA leve.

Serviço: LinkConverter

Funcionalidade: Recebe o link original (ex: amazon.com.br/iphone...).

Lógica: Chama a API de afiliados (Amazon Associates, Magalu, Awin) para gerar o seu deeplink de comissão.

Output: Salva no banco: Título, Preço, Imagem, SeuLink, Data.

Endpoint: /shop/feed

Funcionalidade: Entrega as promoções filtradas para o app.

Smart Sort: Se o usuário tem "iPhone" na Wishlist (ver item 3), o Go coloca promoções de iPhone no topo do JSON desse usuário específico.

3. Wishlist Inteligente (Pretensão de Compras)
Para garantir que o usuário compre pelo seu link.

Endpoint: /wishlist/track

Input: Link ou nome de produto que o usuário quer.

Lógica: O Go faz um crawling leve na página do produto (usando colly ou goquery) para extrair o preço atual e a imagem.

Persistência: Salva no banco com um target_price (preço alvo).

Worker: PriceWatchDog

Funcionalidade: Roda a cada X horas. Verifica o preço atual dos itens nas wishlists.

Trigger: Se Preço Atual < Preço Alvo -> Dispara notificação via OneSignal/Firebase para o celular do usuário ("O iPhone baixou!").

4. Agregador de Mercado Financeiro (Proxy de Cache)
Para evitar que o App faça requisições pesadas ou leve Block de CORS.

Endpoint: /market/news

Lógica: O Go consome RSS Feeds (InfoMoney, Investing) a cada 30 min.

Sanitização: Limpa o HTML, remove tags perigosas, extrai a imagem principal.

Retorno: Um JSON limpo e leve, otimizado para o Mobile.

Endpoint: /market/quotes

Lógica: Consulta a API externa (Brapi/AwesomeAPI) a cada 1 min e guarda em memória. Quando os milhares de usuários abrirem o app, o Go serve da memória (RAM), não da API externa. Isso economiza cotas de API.

5. Sincronização & Controle (Opcional para MVP, vital para Pro)
Endpoint: /sync/push & /sync/pull

Se você quiser que o usuário acesse os dados em dois celulares diferentes, precisará de sync.

Use a lógica de "Deltas" (sincronizar apenas o que mudou desde a last_sync_timestamp).