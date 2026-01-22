# Dinero — Gerenciador Financeiro Pessoal

Aplicativo móvel simples para registrar receitas e despesas, visualizar um resumo com gráfico de pizza e exportar relatórios em PDF. Desenvolvido com Expo + React Native.

**Principais funcionalidades:**

- Registrar transações (descrição, valor, categoria, data).
- Listagem com exclusão individual e reset global das transações.
- Tela de resumo com gráfico de pizza, insights e comparação por período.
- Exportar/compartilhar resumo em PDF (utiliza `expo-print` + `expo-sharing`/Share).
- Persistência local ultra-rápida via `react-native-mmkv` (até 30x mais rápido que AsyncStorage).
- Autenticação biométrica e por senha para segurança.
- Feed de notícias financeiras em tempo real (RSS feeds).

**Tecnologias:**

- Expo (React Native)
- `react-native-mmkv` — armazenamento local de alta performance
- `react-native-sensitive-info` — armazenamento seguro e criptografado para dados bancários
- `@shopify/flash-list` — listas 10x mais performáticas que FlatList
- `@shopify/react-native-skia` — gráficos e animações fluidas com renderização nativa
- `expo-image` — carregamento otimizado de imagens com cache inteligente
- `expo-web-browser` — navegador in-app para notícias
- `fast-xml-parser` — processamento ultra-rápido de RSS feeds
- `react-native-reanimated` — animações de alto desempenho
- `expo-local-authentication` — biometria (Face ID, Touch ID, impressão digital)
- `react-native-chart-kit` / `react-native-svg` — gráficos
- `@expo/vector-icons`, `lucide-react-native` — ícones
- `expo-print`, `expo-sharing` — geração e compartilhamento de PDF

**Estrutura principal (onde procurar):**

- Tela de resumo: [app/(tabs)/sumary.jsx](<app/(tabs)/sumary.jsx>)
- Lista de transações: [app/(tabs)/index.jsx](<app/(tabs)/index.jsx>)
- Formulário de adicionar: [app/(tabs)/add-transaction.jsx](<app/(tabs)/add-transaction.jsx>)
- Layout e navbar: [app/(tabs)/\_layout.jsx](<app/(tabs)/_layout.jsx>)
- Estado global: [context/GlobalState.jsx](context/GlobalState.jsx)
- Componentes reutilizáveis: [components/](components/)

Instalação rápida

1. Instale dependências:

```bash
npm install
```

2. Inicie o projeto com Expo:

```bash
npm run start
# ou
npm run android
npm run ios
```

Notas de desenvolvimento

- Dados persistidos em MMKV com a chave `@dinero:transactions` (performance superior ao AsyncStorage).
- Dados bancários sensíveis podem ser armazenados usando `secureStorage` (criptografado via Keychain/Keystore).
- Listas otimizadas com FlashList (até 10x mais rápido que FlatList padrão).
- Animações fluidas usando Skia (60fps garantido) para gráficos e números animados.
- Imagens otimizadas com expo-image (cache automático, lazy loading, placeholders).
- Feed de notícias RSS processado com fast-xml-parser (InfoMoney e Investing.com).
- Pull-to-refresh para atualizar notícias em tempo real.
- Caso o compartilhamento de PDFs falhe com codificação base64, o fluxo usa agora a API nativa de `Share` e `expo-print` para gerar o arquivo.
- O header global está centralizado em [app/(tabs)/\_layout.jsx](<app/(tabs)/_layout.jsx>); se quiser alterar o título ou botões da navbar, edite esse arquivo.
