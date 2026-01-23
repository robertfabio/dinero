import * as LucideIcons from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DineroButton from "../components/DineroButton";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/globalStyles";

export default function AuthScreen() {
  const {
    hasCredentials,
    biometricAvailable,
    setupPin,
    authenticateWithPin,
    authenticateWithBiometric,
  } = useAuth();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const isSettingUp = !hasCredentials;

  useEffect(() => {
    if (hasCredentials && biometricAvailable) {
      authenticateWithBiometric().catch(() => {
        console.log("Biometric authentication failed");
      });
    }
  }, [hasCredentials, biometricAvailable, authenticateWithBiometric]);

  const handleBiometricAuth = async () => {
    const success = await authenticateWithBiometric();
    if (!success) {
      console.log("Biometric authentication failed");
    }
  };

  const handleSetupPin = async () => {
    if (pin.length < 4) {
      Alert.alert("Erro", "A senha deve ter no mínimo 4 dígitos");
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    const success = await setupPin(pin);
    if (success) {
      Alert.alert("Sucesso", "Senha configurada com sucesso!");
    } else {
      Alert.alert("Erro", "Não foi possível configurar a senha");
    }
  };

  const handleLogin = async () => {
    if (pin.length < 4) {
      Alert.alert("Erro", "Digite sua senha");
      return;
    }

    const success = await authenticateWithPin(pin);
    if (!success) {
      Alert.alert("Erro", "Senha incorreta");
      setPin("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <LucideIcons.Lock size={60} color={COLORS.primary} strokeWidth={2} />
          <Text style={styles.title}>
            {isSettingUp ? "Configure sua Senha" : "Bem-vindo de volta"}
          </Text>
          <Text style={styles.subtitle}>
            {isSettingUp
              ? "Crie uma senha para proteger seus dados financeiros"
              : "Digite sua senha para acessar"}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <LucideIcons.KeyRound
              size={20}
              color={COLORS.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              placeholder={isSettingUp ? "Crie uma senha" : "Digite sua senha"}
              placeholderTextColor={COLORS.textLight}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          {isSettingUp && (
            <View style={styles.inputContainer}>
              <LucideIcons.KeyRound
                size={20}
                color={COLORS.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={confirmPin}
                onChangeText={setConfirmPin}
                placeholder="Confirme sua senha"
                placeholderTextColor={COLORS.textLight}
                secureTextEntry
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          )}

          <View style={{ marginTop: 20 }}>
            <DineroButton
              title={isSettingUp ? "Configurar Senha" : "Entrar"}
              onPress={isSettingUp ? handleSetupPin : handleLogin}
              initialFaceColor={COLORS.primary}
              initialShadowColor="#4ccc47"
              initialTextColor="#000"
            />
          </View>

          {!isSettingUp && biometricAvailable && (
            <Pressable
              style={styles.biometricButton}
              onPress={handleBiometricAuth}
            >
              <LucideIcons.Fingerprint
                size={24}
                color={COLORS.primary}
                strokeWidth={2}
              />
              <Text style={styles.biometricText}>Usar biometria</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 16,
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    padding: 16,
    gap: 8,
  },
  biometricText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
