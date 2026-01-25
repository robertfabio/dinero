import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { COLORS } from "../../styles/globalStyles";

const LanguageSelector = ({ visible, onClose }) => {
  const { t, currentLanguage, changeLanguage, getAvailableLanguages } =
    useLanguage();

  const languages = getAvailableLanguages();

  const handleLanguageSelect = async (languageCode) => {
    await changeLanguage(languageCode);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("settings.language")}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        <FlatList
          data={languages}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.languageItem,
                currentLanguage === item.code && styles.selectedLanguage,
              ]}
              onPress={() => handleLanguageSelect(item.code)}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={styles.languageName}>{item.name}</Text>
              {currentLanguage === item.code && (
                <MaterialIcons name="check" size={24} color={COLORS.primary} />
              )}
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: COLORS.screenBg,
    borderRadius: 16,
    margin: 20,
    maxHeight: "70%",
    minWidth: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedLanguage: {
    backgroundColor: "rgba(113, 255, 108, 0.1)",
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
});

export default LanguageSelector;
