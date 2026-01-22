import { StyleSheet } from "react-native";

export const THEME = {
  primary: "#252525",
  secondary: "#71ff6c",

  background: "#FFFFFF",
  backgroundDark: "#252525",

  text: "#252525",
  textWhite: "#FFFFFF",
  textSecondary: "#666666",

  accent: "#71ff6c",
  border: "#252525",
};
// Paleta de Cores "Gamificada"
export const COLORS = {
  primary: "#1CB0F6", // Azul Ciano (Ação Principal)
  primaryDark: "#1899D6", // Versão mais escura para o "lado 3D" do botão azul

  secondary: "#58CC02", // Verde (Sucesso/Confirmar)
  secondaryDark: "#46A302",

  danger: "#FF4B4B", // Vermelho (Erro/Cancelar)
  dangerDark: "#D33131",

  neutral: "#E5E5E5", // Bordas inativas
  neutralDark: "#CECECE",

  background: "#FFFFFF", // Fundo de cards/inputs
  screenBg: "#F7F7F7", // Fundo da tela (levemente cinza para contraste)

  text: "#4B4B4B", // Texto Principal (Cinza Escuro, nunca preto puro)
  textLight: "#AFAFAF", // Placeholders
  white: "#FFFFFF",
};

// Métricas de Layout Consistentes
export const METRICS = {
  radius: 16,
  borderWidth: 2,
  borderBottomHeight: 4, // O segredo do efeito 3D
  inputHeight: 56,
  padding: 20,
};

export const GlobalStyles = StyleSheet.create({
  // 1. Containers de Tela
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  contentContainer: {
    padding: METRICS.padding,
    flexGrow: 1,
  },

  // 2. Títulos e Textos
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // 3. O "DNA" do Design (Input/Card Base)
  // Use isso como base para qualquer container interativo
  duoContainer: {
    backgroundColor: COLORS.background,
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight, // Efeito 3D
    borderColor: COLORS.neutral,
    borderRadius: METRICS.radius,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  // 4. Botão Primário (Azul)
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: METRICS.radius,
    borderWidth: 0, // Botões coloridos geralmente não tem stroke lateral no estilo flat moderno
    borderBottomWidth: METRICS.borderBottomHeight,
    borderBottomColor: COLORS.primaryDark, // Sombra solida
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // 5. Botão Secundário (Branco/Outline)
  secondaryButton: {
    backgroundColor: COLORS.white,
    height: 56,
    borderRadius: METRICS.radius,
    borderWidth: METRICS.borderWidth,
    borderColor: COLORS.neutral,
    borderBottomWidth: METRICS.borderBottomHeight,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  secondaryButtonText: {
    color: COLORS.text, // ou COLORS.primary
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // 6. Utilitários
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
