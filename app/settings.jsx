import { useRouter } from "expo-router";
import * as LucideIcons from "lucide-react-native";
import { useContext, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DineroAlert from "../components/DineroAlert";
import SecuritySettings from "../components/SecuritySettings";
import { DineroContext } from "../context/GlobalState";
import { COLORS, METRICS } from "../styles/globalStyles";
import { storageUtils } from "../utils/storage";

export default function SettingsScreen() {
  const router = useRouter();
  const [transactions] = useContext(DineroContext);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
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

  const handleExportData = async () => {
    if (!transactions || transactions.length === 0) {
      showAlert({
        title: "Sem Dados",
        message: "Você não possui transações para exportar.",
        type: "info",
      });
      return;
    }

    try {
      const header = "Data,Descrição,Valor,Categoria\n";
      const rows = transactions
        .map(
          (t) =>
            `${t.date},"${t.description}",${t.value.toFixed(2)},${t.category}`,
        )
        .join("\n");
      const csvContent = header + rows;

      const total = transactions.reduce((sum, t) => {
        const isIncome = ["income", "salary"].includes(t.category);
        return sum + (isIncome ? t.value : -t.value);
      }, 0);

      const message = `📊 Resumo das suas transações\n\nTotal de transações: ${transactions.length}\nSaldo: R$ ${total.toFixed(2)}\n\n${csvContent}`;

      await Share.share({
        message: message,
        title: "Minhas Transações - Dinero",
      });
    } catch {
      showAlert({
        title: "Erro",
        message: "Não foi possível exportar os dados.",
        type: "error",
      });
    }
  };

  const handleImportData = () => {
    showAlert({
      title: "Em Breve",
      message:
        "Em breve você poderá importar suas transações de outros aplicativos.",
      type: "info",
    });
  };

  const handleClearCache = async () => {
    showAlert({
      title: "Limpar Cache",
      message:
        "Isso irá limpar dados temporários do aplicativo. Suas transações e configurações serão mantidas.",
      type: "warning",
      showCancel: true,
      confirmText: "Limpar",
      onConfirm: async () => {
        try {
          const transactionsData = await storageUtils.getItem(
            "@dinero:transactions",
          );
          const authData = await storageUtils.getItem("@dinero:auth");

          await storageUtils.clear();

          if (transactionsData) {
            await storageUtils.setItem(
              "@dinero:transactions",
              transactionsData,
            );
          }
          if (authData) {
            await storageUtils.setItem("@dinero:auth", authData);
          }

          setTimeout(() => {
            showAlert({
              title: "Sucesso",
              message:
                "Cache limpo com sucesso! Dados importantes foram preservados.",
              type: "success",
            });
          }, 300);
        } catch {
          showAlert({
            title: "Erro",
            message: "Não foi possível limpar o cache.",
            type: "error",
          });
        }
      },
    });
  };

  const handleResetAllData = async () => {
    showAlert({
      title: "⚠️ Resetar Tudo",
      message:
        "ATENÇÃO: Esta ação irá apagar TODAS as suas transações e configurações. Esta ação não pode ser desfeita!",
      type: "error",
      showCancel: true,
      confirmText: "Resetar Tudo",
      onConfirm: async () => {
        try {
          await storageUtils.removeItem("@dinero:transactions");
          await storageUtils.removeItem("@dinero:auth");
          setTimeout(() => {
            showAlert({
              title: "Sucesso",
              message:
                "Todos os dados foram removidos. O aplicativo será reiniciado.",
              type: "success",
              onConfirm: () => {
                if (global.location) {
                  global.location.reload();
                }
              },
            });
          }, 300);
        } catch {
          showAlert({
            title: "Erro",
            message: "Não foi possível resetar os dados.",
            type: "error",
          });
        }
      },
    });
  };

  const SettingOption = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    danger,
    badge,
  }) => (
    <Pressable
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, danger && styles.iconDanger]}>
        <Icon
          size={22}
          color={danger ? COLORS.danger : COLORS.primary}
          strokeWidth={2.5}
        />
      </View>
      <View style={styles.optionContent}>
        <View style={styles.optionTitleRow}>
          <Text style={[styles.optionTitle, danger && styles.textDanger]}>
            {title}
          </Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <LucideIcons.ArrowLeft
              size={32}
              color={COLORS.text}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <View style={styles.iconHeader}>
            <LucideIcons.Settings
              size={56}
              color={COLORS.primary}
              strokeWidth={2}
            />
          </View>
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>
            Personalize e gerencie o aplicativo
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>
          <SettingOption
            icon={LucideIcons.Shield}
            title="Segurança e Privacidade"
            subtitle="Autenticação, biometria e senha"
            onPress={() => setSecurityModalVisible(true)}
            badge="Protegido"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          <SettingOption
            icon={LucideIcons.Download}
            title="Exportar Dados"
            subtitle="Baixar suas transações em CSV/PDF"
            onPress={handleExportData}
          />
          <SettingOption
            icon={LucideIcons.Upload}
            title="Importar Dados"
            subtitle="Importar de outro aplicativo"
            onPress={handleImportData}
          />
          <SettingOption
            icon={LucideIcons.Trash2}
            title="Limpar Cache"
            subtitle="Remover dados temporários"
            onPress={handleClearCache}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <SettingOption
            icon={LucideIcons.Palette}
            title="Tema"
            subtitle="Claro, escuro ou automático"
            onPress={() =>
              showAlert({
                title: "Em Breve",
                message: "Funcionalidade em desenvolvimento",
                type: "info",
              })
            }
            badge="Em breve"
          />
          <SettingOption
            icon={LucideIcons.Languages}
            title="Idioma"
            subtitle="Português (Brasil)"
            onPress={() =>
              showAlert({
                title: "Em Breve",
                message: "Funcionalidade em desenvolvimento",
                type: "info",
              })
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <SettingOption
            icon={LucideIcons.Info}
            title="Sobre o Dinero"
            subtitle="Versão 1.0.0 - Build 2026"
            onPress={() =>
              showAlert({
                title: "Dinero",
                message:
                  "Aplicativo de controle financeiro pessoal.\n\nVersão: 1.0.0\nDesenvolvido em 2026",
                type: "info",
              })
            }
          />
          <SettingOption
            icon={LucideIcons.LucideFileText}
            title="Termos de Serviço"
            subtitle="Consulte os termos legais"
            onPress={() =>
              Linking.openURL("https://robertfabio.github.io/privacy-policy-dinero/").catch((err) =>
                console.error("Failed to open URL:", err),
              )
            }
          />
          <SettingOption
            icon={LucideIcons.Heart}
            title="Avaliar o App"
            subtitle="Deixe sua avaliação na loja"
            onPress={() =>
              showAlert({
                title: "Em Breve",
                message: "Funcionalidade em desenvolvimento",
                type: "info",
              })
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de Perigo</Text>
          <SettingOption
            icon={LucideIcons.AlertTriangle}
            title="Resetar Todos os Dados"
            subtitle="Apagar todas transações e configurações"
            onPress={handleResetAllData}
            danger
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dinero • Controle Financeiro Pessoal
          </Text>
          <Text style={styles.footerSubtext}>Feito para você</Text>
        </View>
      </ScrollView>

      <Modal
        visible={securityModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSecurityModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Segurança</Text>
            <TouchableOpacity
              onPress={() => setSecurityModalVisible(false)}
              style={styles.closeButton}
            >
              <LucideIcons.X size={24} color={COLORS.primary} strokeWidth={3} />
            </TouchableOpacity>
          </View>
          <SecuritySettings onClose={() => setSecurityModalVisible(false)} />
        </View>
      </Modal>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  backButton: {
    borderWidth: 2,
    borderColor: COLORS.neutralDark,
    borderRadius: 12,
    padding: 24,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 8,
  },
  iconHeader: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(28, 176, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: METRICS.radius,
    padding: 12,
    marginBottom: 12,
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderColor: COLORS.neutral,
  },
  optionPressed: {
    backgroundColor: "rgba(28, 176, 246, 0.05)",
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(28, 176, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconDanger: {
    backgroundColor: "rgba(255, 75, 75, 0.1)",
  },
  optionContent: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  textDanger: {
    color: COLORS.danger,
  },
  badge: {
    backgroundColor: "rgba(28, 176, 246, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    bottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: COLORS.background,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
  },
});