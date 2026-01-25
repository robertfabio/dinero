import { LinearGradient } from "expo-linear-gradient";
import {
  AlertTriangle,
  Mail,
  MessageCircle,
  RefreshCw
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../styles/globalStyles";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleEmail = () => {
    const subject = "Erro no App Dinero";
    const body = `Olá, encontrei um erro no aplicativo Dinero:\n\n${this.state.error?.toString() || "Erro desconhecido"}\n\nPor favor, ajudem a corrigir este problema.`;
    const mailto = `mailto:suporte@dinero.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o cliente de email");
    });
  };

  handleFeedback = () => {
    Alert.prompt(
      "Conte-nos o que aconteceu",
      "Descreva o que você estava fazendo quando o erro ocorreu:",
      (text) => {
        if (text) {
          Alert.alert(
            "Obrigado!",
            "Seu feedback foi registrado. Nossa equipe irá analisar o problema.",
            [{ text: "OK" }],
          );
        }
      },
      "plain-text",
      "",
      "default",
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={COLORS.primary}
          />

          <LinearGradient
            colors={[COLORS.primary, "#1B9AE4"]}
            style={styles.header}
          >
            <AlertTriangle size={64} color="white" strokeWidth={2} />
            <Text style={styles.title}>Ops! Algo deu errado</Text>
            <Text style={styles.subtitle}>
              Não se preocupe, esses problemas acontecem. Vamos resolver isso
              juntos!
            </Text>
          </LinearGradient>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>O que você pode fazer:</Text>

              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={this.handleRestart}
              >
                <RefreshCw size={20} color="white" strokeWidth={2.5} />
                <Text style={styles.primaryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={this.handleEmail}
              >
                <Mail size={20} color={COLORS.primary} strokeWidth={2.5} />
                <Text style={styles.buttonText}>Enviar Email para Suporte</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={this.handleFeedback}
              >
                <MessageCircle
                  size={20}
                  color={COLORS.primary}
                  strokeWidth={2.5}
                />
                <Text style={styles.buttonText}>Relatar Problema</Text>
              </TouchableOpacity>
            </View>

            {__DEV__ && this.state.error && (
              <View style={styles.debugSection}>
                <Text style={styles.debugTitle}>Informações para Debug:</Text>
                <View style={styles.debugBox}>
                  <Text style={styles.debugText}>
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo?.componentStack && (
                    <Text style={styles.debugText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  debugSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textLight,
    marginBottom: 12,
  },
  debugBox: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
  },
  debugText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
    lineHeight: 16,
  },
});

export default ErrorBoundary;
