import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, GlobalStyles, METRICS } from "../styles/globalStyles";
import DineroButton from "./DineroButton";

export default function DineroModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const icons = {
    warning: { name: "warning", color: COLORS.danger },
    info: { name: "info", color: COLORS.primary },
    success: { name: "check-circle", color: COLORS.secondary },
  };

  const icon = icons[type] || icons.info;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.12)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          opacity: fadeAnim,
        }}
      >
        <Pressable
          style={{ position: "absolute", width: "100%", height: "100%" }}
          onPress={onClose}
        />
        <Animated.View
          style={[
            GlobalStyles.duoContainer,
            {
              width: "100%",
              maxWidth: 400,
              padding: 24,
              backgroundColor: COLORS.background,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <MaterialIcons name={icon.name} size={56} color={icon.color} />
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: COLORS.text,
              textAlign: "center",
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: COLORS.textLight,
              textAlign: "center",
              marginBottom: 24,
              lineHeight: 22,
            }}
          >
            {message}
          </Text>

          <View style={{ gap: 12 }}>
            <DineroButton
              title={confirmText}
              onPress={() => {
                onConfirm();
                onClose();
              }}
              style={{ width: "100%", height: 50 }}
              textStyle={{ fontSize: 16 }}
              initialFaceColor={
                type === "warning" ? COLORS.danger : COLORS.primary
              }
              initialShadowColor={
                type === "warning" ? COLORS.dangerDark : COLORS.primaryDark
              }
              initialTextColor={COLORS.white}
              useParticles={false}
            />
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.4}
              style={{
                backgroundColor: COLORS.background,
                height: 50,
                borderRadius: METRICS.radius,
                borderWidth: METRICS.borderWidth,
                borderColor: COLORS.neutral,
                borderBottomWidth: METRICS.borderBottomHeight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 18,
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
