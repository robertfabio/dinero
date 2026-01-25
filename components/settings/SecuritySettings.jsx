import * as LucideIcons from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../styles/globalStyles";
import DineroAlert from "../DineroAlert";

export default function SecuritySettings({ onClose }) {
  const { logout, resetAuth, biometricAvailable } = useAuth();
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "info",
    showCancel: false,
    confirmText: "OK",
  });

  const showAlert = (config) => {
    setAlertConfig({ ...config, visible: true });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const handleLogout = () => {
    showAlert({
      title: "Sair",
      message:
        "Deseja sair do aplicativo? Você precisará autenticar novamente.",
      type: "warning",
      showCancel: true,
      confirmText: "Sair",
      cancelText: "Cancelar",
      onConfirm: () => {
        logout();
        onClose?.();
      },
    });
  };

  const handleResetAuth = () => {
    showAlert({
      title: "Resetar Segurança",
      message:
        "Isso irá remover sua senha configurada. Você precisará configurar uma nova senha na próxima vez que abrir o app.",
      type: "warning",
      showCancel: true,
      confirmText: "Resetar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        const success = await resetAuth();
        setTimeout(() => {
          showAlert({
            title: success ? "Sucesso" : "Erro",
            message: success
              ? "Configurações de segurança resetadas"
              : "Não foi possível resetar as configurações",
            type: success ? "success" : "error",
            showCancel: false,
          });
        }, 300);
      },
    });
  };

  const SecurityOption = ({ icon: Icon, title, subtitle, onPress, danger }) => (
    <Pressable
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, danger && styles.iconDanger]}>
        <Icon
          size={24}
          color={danger ? COLORS.danger : COLORS.primary}
          strokeWidth={2}
        />
      </View>
      <View style={styles.optionContent}>
        <Text style={[styles.optionTitle, danger && styles.textDanger]}>
          {title}
        </Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <LucideIcons.ChevronRight
        size={20}
        color={COLORS.textLight}
        strokeWidth={2}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autenticação</Text>

          <View style={styles.infoCard}>
            <LucideIcons.Info
              size={20}
              color={COLORS.primary}
              strokeWidth={2}
            />
            <Text style={styles.infoText}>
              {biometricAvailable
                ? "Biometria está ativa e disponível no seu dispositivo"
                : "Biometria não está disponível neste dispositivo"}
            </Text>
          </View>

          <SecurityOption
            icon={LucideIcons.LogOut}
            title="Sair"
            subtitle="Sair do aplicativo sem remover dados"
            onPress={handleLogout}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de Perigo</Text>

          <SecurityOption
            icon={LucideIcons.ShieldOff}
            title="Resetar Segurança"
            subtitle="Remove todas as configurações de autenticação"
            onPress={handleResetAuth}
            danger
          />
        </View>
      </ScrollView>

      <DineroAlert
        visible={alertConfig.visible}
        onClose={hideAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        type={alertConfig.type}
        showCancel={alertConfig.showCancel}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  content: {
    padding: 20,
    paddingTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(113, 255, 108, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  optionPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(113, 255, 108, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconDanger: {
    backgroundColor: "rgba(255, 59, 48, 0.15)",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  textDanger: {
    color: COLORS.danger,
  },
});
