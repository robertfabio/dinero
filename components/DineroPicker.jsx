import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const DineroPicker = ({
  label,
  value,
  options = [],
  onSelect,
  placeholder = "Selecione...",
}) => {
  const [visible, setVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openModal = () => {
    animatePress();
    setVisible(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleSelect = (item) => {
    onSelect(item);
    closeModal();
  };

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;
  const selectedIcon = options.find((opt) => opt.value === value)?.icon;
  const selectedBackground = options.find(
    (opt) => opt.value === value,
  )?.background;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity activeOpacity={1} onPress={openModal}>
        <Animated.View
          style={[styles.pickerButton, { transform: [{ scale: scaleValue }] }]}
        >
          {selectedIcon && (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: selectedBackground || "#F0F0F0" },
              ]}
            >
              <MaterialIcons name={selectedIcon} size={24} color="#4B4B4B" />
            </View>
          )}
          <Text style={[styles.pickerText, !value && styles.placeholderText]}>
            {selectedLabel}
          </Text>
          <View style={styles.chevron}>
            <Text style={styles.chevronText}>▼</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeModal} />

          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0], // Desliza de baixo para cima
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || "Escolha uma opção"}
              </Text>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    {item.icon && (
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: item.background || "#F0F0F0" },
                        ]}
                      >
                        <MaterialIcons
                          name={item.icon}
                          size={24}
                          color="#4B4B4B"
                        />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>FECHAR</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B4B4B",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  pickerButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderBottomWidth: 4,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerText: {
    fontSize: 18,
    color: "#4B4B4B",
    fontWeight: "600",
    flex: 1,
  },
  placeholderText: {
    color: "#AFAFAF",
  },
  chevron: {
    marginLeft: 10,
  },
  chevronText: {
    color: "#AFAFAF",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B4B4B",
    textTransform: "uppercase",
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    gap: 12,
  },
  optionSelected: {
    backgroundColor: "#DDF4FF",
    borderColor: "#1CB0F6",
    borderBottomWidth: 4,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#777",
    flex: 1,
  },
  optionTextSelected: {
    color: "#1CB0F6",
    fontWeight: "bold",
  },
  checkIcon: {
    fontSize: 20,
    color: "#1CB0F6",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderBottomWidth: 4,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  closeButtonText: {
    fontWeight: "bold",
    color: "#AFAFAF",
    fontSize: 16,
  },
});

export default DineroPicker;
