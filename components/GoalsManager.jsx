import { MaterialIcons } from "@expo/vector-icons";
import * as LucideIcons from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, GlobalStyles, METRICS } from "../styles/globalStyles";

const GOAL_PRESETS = [
  {
    id: "emergency",
    label: "Fundo de Emergência",
    icon: "shield",
    value: 10000,
  },
  { id: "car", label: "Carro Novo", icon: "directions-car", value: 50000 },
  { id: "motorcycle", label: "Moto", icon: "two-wheeler", value: 15000 },
  { id: "house", label: "Casa Própria", icon: "home", value: 300000 },
  { id: "travel", label: "Viagem", icon: "flight", value: 5000 },
  { id: "custom", label: "Personalizado", icon: "edit", value: 0 },
];

export default function GoalsManager({ balance, currentGoal, onGoalChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [customGoalName, setCustomGoalName] = useState("");
  const [customGoalValue, setCustomGoalValue] = useState("");

  const percentage = currentGoal?.value
    ? Math.min((balance / currentGoal.value) * 100, 100)
    : 0;
  const remaining = currentGoal?.value
    ? Math.max(currentGoal.value - balance, 0)
    : 0;

  const handleGoalSelect = (goal) => {
    if (goal.id === "custom") {
      setSelectedGoal(goal);
    } else {
      onGoalChange({ ...goal, name: goal.label });
      setModalVisible(false);
    }
  };

  const handleCustomGoalSave = () => {
    if (!customGoalName.trim() || !customGoalValue) return;

    const value = parseFloat(customGoalValue.replace(/\D/g, "")) / 100;
    if (value <= 0) return;

    onGoalChange({
      id: "custom",
      name: customGoalName,
      icon: "flag",
      value: value,
    });
    setCustomGoalName("");
    setCustomGoalValue("");
    setSelectedGoal(null);
    setModalVisible(false);
  };

  return (
    <>
      <View style={[GlobalStyles.duoContainer, { padding: 20 }]}>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name={currentGoal?.icon || "flag"}
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.title}>
              {currentGoal?.name || "Definir Meta"}
            </Text>
          </View>
          <LucideIcons.Settings
            size={20}
            color={COLORS.primary}
            strokeWidth={2.5}
          />
        </Pressable>

        {currentGoal && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                Atual:{" "}
                {balance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
              <Text style={styles.infoText}>
                Meta:{" "}
                {currentGoal.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${percentage}%`,
                    backgroundColor:
                      percentage >= 100 ? COLORS.secondary : COLORS.primary,
                  },
                ]}
              />
            </View>

            {percentage >= 100 ? (
              <View style={styles.successRow}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.secondary}
                />
                <Text style={styles.successText}>
                  Meta alcançada! Parabéns! 🎉
                </Text>
              </View>
            ) : (
              <Text style={styles.remainingText}>
                Faltam{" "}
                {remaining.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
                ({percentage.toFixed(1)}%)
              </Text>
            )}
          </>
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedGoal(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Escolha sua Meta</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSelectedGoal(null);
              }}
              style={styles.closeButton}
            >
              <LucideIcons.X size={24} color={COLORS.primary} strokeWidth={3} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedGoal?.id === "custom" ? (
              <View style={styles.customGoalForm}>
                <Text style={styles.formLabel}>Nome da Meta</Text>
                <TextInput
                  style={styles.input}
                  value={customGoalName}
                  onChangeText={setCustomGoalName}
                  placeholder="Ex: Notebook Novo"
                  placeholderTextColor={COLORS.textLight}
                />

                <Text style={[styles.formLabel, { marginTop: 16 }]}>
                  Valor da Meta
                </Text>
                <TextInput
                  style={styles.input}
                  value={customGoalValue}
                  onChangeText={(text) => {
                    const formatted = text.replace(/\D/g, "");
                    const numericValue = formatted
                      ? parseFloat(formatted) / 100
                      : 0;
                    setCustomGoalValue(
                      numericValue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }),
                    );
                  }}
                  placeholder="R$ 0,00"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textLight}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setSelectedGoal(null)}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.cancelButtonText}>Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCustomGoalSave}
                    style={[styles.button, styles.saveButton]}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.goalsGrid}>
                {GOAL_PRESETS.map((goal) => (
                  <Pressable
                    key={goal.id}
                    onPress={() => handleGoalSelect(goal)}
                    style={({ pressed }) => [
                      styles.goalCard,
                      pressed && styles.goalCardPressed,
                      currentGoal?.id === goal.id && styles.goalCardActive,
                    ]}
                  >
                    <MaterialIcons
                      name={goal.icon}
                      size={32}
                      color={
                        currentGoal?.id === goal.id
                          ? COLORS.primary
                          : COLORS.textLight
                      }
                    />
                    <Text style={styles.goalLabel}>{goal.label}</Text>
                    {goal.value > 0 && (
                      <Text style={styles.goalValue}>
                        {goal.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    textTransform: "uppercase",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  progressBar: {
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  successText: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: "700",
    marginLeft: 4,
  },
  remainingText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
    marginTop: 8,
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
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    padding: 20,
  },
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  goalCard: {
    width: "48%",
    backgroundColor: COLORS.background,
    borderRadius: METRICS.radius,
    padding: 20,
    alignItems: "center",
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderColor: COLORS.neutral,
  },
  goalCardPressed: {
    backgroundColor: "rgba(28, 176, 246, 0.05)",
  },
  goalCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(28, 176, 246, 0.1)",
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 8,
  },
  goalValue: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textLight,
    marginTop: 4,
  },
  customGoalForm: {
    backgroundColor: COLORS.background,
    borderRadius: METRICS.radius,
    padding: 20,
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderColor: COLORS.neutral,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderColor: COLORS.neutral,
    borderRadius: METRICS.radius,
    padding: 16,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: METRICS.radius,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderColor: COLORS.neutral,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    textTransform: "uppercase",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderBottomColor: COLORS.primaryDark,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
    textTransform: "uppercase",
  },
});
