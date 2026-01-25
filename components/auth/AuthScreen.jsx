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
import { useLanguage } from "./../../context/LanguageContext";
import { COLORS, GlobalStyles, METRICS } from "./../../styles/globalStyles";

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
  const { t } = useLanguage();
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
    if (isSettingUp)
      return step === "confirm" ? t("auth.confirmPin") : t("auth.createPin");
    return t("auth.welcome");
  };

  const getSubtitle = () => {
    if (isSettingUp)
      return step === "confirm"
        ? t("auth.enterPinAgain")
        : t("auth.create4DigitPin");
    return t("auth.enterPinToAccess");
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeTranslateX.value }],
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.logoContainer}
        >
          <View style={styles.logoIcon}>
            <LucideIcons.Wallet
              size={32}
              color={COLORS.primary}
              strokeWidth={2.5}
            />
          </View>
          <Text style={styles.appName}>Dinero</Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(200)}
          style={[styles.content, animatedCardStyle]}
        >
          <View style={[GlobalStyles.duoContainer, styles.card]}>
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
                <LucideIcons.Fingerprint
                  size={20}
                  color={COLORS.primary}
                  strokeWidth={2}
                />
                <Text style={styles.bioText}>{t("auth.useBiometric")}</Text>
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
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>{t("common.cancel")}</Text>
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
    backgroundColor: COLORS.screenBg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoIcon: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.background,
    borderRadius: METRICS.radius,
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderColor: COLORS.neutral,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    ...GlobalStyles.shadow,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: 1,
  },
  content: {
    width: "100%",
  },
  card: {
    padding: 32,
    alignItems: "center",
    ...GlobalStyles.shadow,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "600",
    textAlign: "center",
  },
  inputArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 28,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
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
    paddingHorizontal: 20,
    borderRadius: METRICS.radius,
    borderWidth: METRICS.borderWidth,
    borderColor: COLORS.neutral,
    borderBottomWidth: METRICS.borderBottomHeight,
    backgroundColor: COLORS.background,
    marginTop: 8,
  },
  bioButtonPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: METRICS.borderWidth,
  },
  bioText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: COLORS.textLight,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
