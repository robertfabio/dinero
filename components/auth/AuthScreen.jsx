import * as LucideIcons from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useAuth } from "./../../context/AuthContext";
import { COLORS } from "./../../styles/globalStyles";

const PinDot = ({ filled, error }) => {
  const scale = useSharedValue(1);
  const colorAnim = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(filled ? 1.2 : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled]);

  useEffect(() => {
    if (error) {
      colorAnim.value = withSequence(
        withTiming(1, { duration: 50 }),
        withRepeat(withTiming(0, { duration: 100 }), 3, true),
        withTiming(0, { duration: 50 }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: filled ? COLORS.primary : "transparent",
      borderColor: error
        ? COLORS.danger
        : filled
          ? COLORS.primary
          : COLORS.neutral,
    };
  });

  return <Animated.View style={[styles.pinDot, animatedStyle]} />;
};

export default function AuthScreen() {
  const {
    hasCredentials,
    biometricAvailable,
    setupPin,
    authenticateWithPin,
    authenticateWithBiometric,
  } = useAuth();

  const [pin, setPin] = useState("");
  const [step, setStep] = useState("pin");
  const [errorState, setErrorState] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");

  const inputRef = useRef(null);
  const isSettingUp = !hasCredentials;

  const shakeTranslateX = useSharedValue(0);

  useEffect(() => {
    if (hasCredentials && biometricAvailable) {
      authenticateWithBiometric();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCredentials, biometricAvailable]);

  const triggerError = () => {
    setErrorState(true);
    shakeTranslateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 }),
    );
    setTimeout(() => {
      setPin("");
      setErrorState(false);
    }, 500);
  };

  const handlePinChange = async (text) => {
    const sanitizedText = text.replace(/[^0-9]/g, "");
    setPin(sanitizedText);
    setErrorState(false);

    if (sanitizedText.length === 4) {
      Keyboard.dismiss();

      if (isSettingUp) {
        if (step === "pin") {
          setConfirmPin(sanitizedText);
          setPin("");
          setStep("confirm");
          setTimeout(() => inputRef.current?.focus(), 100);
        } else {
          if (confirmPin === sanitizedText) {
            const success = await setupPin(sanitizedText);
            if (!success) triggerError();
          } else {
            triggerError();
            setPin("");
            setStep("pin");
            setConfirmPin("");
          }
        }
      } else {
        const success = await authenticateWithPin(sanitizedText);
        if (!success) triggerError();
      }
    }
  };

  const getTitle = () => {
    if (isSettingUp) return step === "confirm" ? "CONFIRMAR" : "CRIAR SENHA";
    return "BEM-VINDO";
  };

  const getSubtitle = () => {
    if (isSettingUp)
      return step === "confirm"
        ? "Digite a senha novamente"
        : "Crie uma senha de 4 dígitos";
    return "Digite sua senha para entrar";
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeTranslateX.value }],
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <Animated.View
          entering={FadeInDown.duration(800)}
          style={styles.logoContainer}
        >
          <View style={styles.logoIcon}>
            <LucideIcons.Wallet size={40} color="white" strokeWidth={2.5} />
          </View>
          <Text style={styles.appName}>DINERO</Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(300)}
          style={[styles.content, animatedCardStyle]}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{getTitle()}</Text>
              <Text style={styles.subtitle}>{getSubtitle()}</Text>
            </View>

            <Pressable
              style={styles.inputArea}
              onPress={() => inputRef.current?.focus()}
            >
              <View style={styles.dotsContainer}>
                {[0, 1, 2, 3].map((i) => (
                  <PinDot key={i} filled={i < pin.length} error={errorState} />
                ))}
              </View>

              <TextInput
                ref={inputRef}
                value={pin}
                onChangeText={handlePinChange}
                keyboardType="number-pad"
                maxLength={4}
                style={styles.hiddenInput}
                caretHidden
                autoFocus
              />
            </Pressable>

            {biometricAvailable && !isSettingUp && (
              <Pressable
                onPress={authenticateWithBiometric}
                style={({ pressed }) => [
                  styles.bioButton,
                  pressed && styles.bioButtonPressed,
                ]}
              >
                <LucideIcons.Fingerprint size={24} color={COLORS.primary} />
                <Text style={styles.bioText}>USAR BIOMETRIA</Text>
              </Pressable>
            )}

            {step === "confirm" && (
              <Pressable
                onPress={() => {
                  setStep("pin");
                  setPin("");
                  setConfirmPin("");
                  inputRef.current?.focus();
                }}
              >
                <Text style={styles.cancelText}>CANCELAR</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -100,
    right: -20,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 16,
    transform: [{ rotate: "-5deg" }],
  },
  appName: {
    fontSize: 32,
    fontWeight: "900",
    color: "white",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    width: "100%",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.neutral,
    borderBottomWidth: 6,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  inputArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  bioButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.neutral,
    borderBottomWidth: 4,
    backgroundColor: "#F7F7F7",
  },
  bioButtonPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  bioText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },
  cancelText: {
    marginTop: 20,
    color: COLORS.textLight,
    fontWeight: "700",
    fontSize: 12,
  },
});
