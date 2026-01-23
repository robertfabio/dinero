import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, METRICS } from "../styles/globalStyles";

export default function DineroAlert({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancelar",
  type = "info",
  showCancel = false,
  icon,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [visible, scaleAnim, fadeAnim]);

  const typeConfig = {
    success: {
      icon: "check-circle",
      color: COLORS.secondary,
      bgColor: "rgba(88, 204, 2, 0.1)",
    },
    error: {
      icon: "error",
      color: COLORS.danger,
      bgColor: "rgba(255, 75, 75, 0.1)",
    },
    warning: {
      icon: "warning",
      color: "#FF9500",
      bgColor: "rgba(255, 149, 0, 0.1)",
    },
    info: {
      icon: "info",
      color: COLORS.primary,
      bgColor: "rgba(28, 176, 246, 0.1)",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable
          style={styles.backdrop}
          onPress={showCancel ? onClose : null}
        />
        <Animated.View
          style={[styles.alertContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <View
            style={[styles.iconCircle, { backgroundColor: config.bgColor }]}
          >
            {icon || (
              <MaterialIcons
                name={config.icon}
                size={48}
                color={config.color}
              />
            )}
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                onConfirm?.();
                onClose();
              }}
              activeOpacity={0.7}
              style={[
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor:
                    type === "error" || type === "warning"
                      ? COLORS.danger
                      : COLORS.primary,
                  borderBottomColor:
                    type === "error" || type === "warning"
                      ? COLORS.dangerDark
                      : COLORS.primaryDark,
                },
                !showCancel && { flex: 1 },
              ]}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  alertContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.background,
    borderRadius: METRICS.radius,
    padding: 24,
    alignItems: "center",
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderColor: COLORS.neutral,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
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
    letterSpacing: 0.5,
  },
  confirmButton: {
    borderWidth: 0,
    borderBottomWidth: METRICS.borderBottomHeight,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
