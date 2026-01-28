# 📊 Componentes de Grid para Home - Dinero

## 🎯 Componentes Criados

### 📈 Módulo Fiscal/Tributário

- **TaxCalculatorCard**: Calculadora de impostos (INSS/IRRF) com simulação de salário líquido
- **DeductibleTransactionsCard**: Gerenciador de deduções do IRPF para pessoa física

### 💳 Módulo Dívidas/Crédito

- **DebtCommitmentCard**: Visualizador de compromissos financeiros com gauge de comprometimento
- **InstallmentAdvanceCard**: Simulador de antecipação de parcelas vs CDI

### 🚗 Módulo Veículos

- **FipeCard**: Consulta de valor FIPE de veículos
- **FuelCalculatorCard**: Calculadora álcool vs gasolina (regra dos 70%)

### 💰 Módulo Investimentos

- **SavingsVsCDICard**: Comparador poupança vs CDI
- **CurrencyConverterCard**: Conversor de moedas em tempo real (USD/EUR/BTC)

## 🔧 Componentes Base

- **GridCard**: Componente base com variantes (primary/secondary/neutral) e efeito 3D
- **ResponsiveGrid**: Container responsivo com 1-2 colunas
- **DineroButton**: Botão personalizado do app (já existia)

## 📱 Design System

Todos os componentes seguem o design system do app:

- Cores do [globalStyles.js](styles/globalStyles.js) (COLORS.primary, secondary, neutral)
- Bordas arredondadas com efeito 3D (borderBottomWidth)
- Espaçamento consistente (METRICS.padding, radius)
- Sem gradientes lineares - apenas cores sólidas

## 📋 Estrutura de Arquivos

```
components/
├── fiscal/
│   ├── TaxCalculatorCard.jsx
│   └── DeductibleTransactionsCard.jsx
├── debt/
│   ├── DebtCommitmentCard.jsx
│   └── InstallmentAdvanceCard.jsx
├── vehicle/
│   ├── FipeCard.jsx
│   └── FuelCalculatorCard.jsx
├── investments/
│   ├── SavingsVsCDICard.jsx
│   └── CurrencyConverterCard.jsx
├── ui/
│   ├── GridCard.jsx
│   └── ResponsiveGrid.jsx
├── hooks/
│   ├── useTaxCalculations.js
│   ├── useDebtManagement.js
│   ├── useVehicleData.js
│   └── useInvestmentCalculations.js
└── grids/
    └── HomeGridExample.jsx
```

## 🚀 Como Usar na Home

```jsx
import { ResponsiveGrid } from "../components/ui/ResponsiveGrid";
import { TaxCalculatorCard } from "../components/fiscal/TaxCalculatorCard";
// ... outros imports

export default function HomeScreen() {
  return (
    <ResponsiveGrid>
      <TaxCalculatorCard />
      <DeductibleTransactionsCard />
      <DebtCommitmentCard />
      {/* Adicione mais cards conforme necessário */}
    </ResponsiveGrid>
  );
}
```

## ✅ Status

- ✅ Criados: 8 componentes de negócio + 2 UI + 4 hooks + exemplo
- ✅ Design system integrado (cores, bordas, espaçamento)
- ✅ Código limpo (sem comentários desnecessários)
- ✅ Imports organizados
- ✅ Sem barrel exports (imports diretos)

Todos os componentes estão prontos para uso na home do Dinero! 🎉
