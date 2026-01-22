import * as LucideIcons from "lucide-react-native";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/globalStyles";

export default function SecuritySettings() {
  const { logout, resetAuth, biometricAvailable } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja sair do aplicativo? Você precisará autenticar novamente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => logout(),
        },
      ],
    );
  };

  const handleResetAuth = () => {
    Alert.alert(
      "Resetar Segurança",
      "Isso irá remover sua senha configurada. Você precisará configurar uma nova senha na próxima vez que abrir o app.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: async () => {
            const success = await resetAuth();
            if (success) {
              Alert.alert("Sucesso", "Configurações de segurança resetadas");
            } else {
              Alert.alert("Erro", "Não foi possível resetar as configurações");
            }
          },
        },
      ],
    );
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <LucideIcons.Shield
            size={60}
            color={COLORS.primary}
            strokeWidth={2}
          />
          <Text style={styles.title}>Segurança</Text>
          <Text style={styles.subtitle}>
            Gerencie suas configurações de privacidade e autenticação
          </Text>
        </View>

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

          <SecurityOption
            icon={LucideIcons.Key}
            title="Alterar Senha"
            subtitle="Configure uma nova senha de acesso"
            onPress={() =>
              Alert.alert("Em breve", "Funcionalidade em desenvolvimento")
            }
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
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
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
    padding: 16,
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
    padding: 16,
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
