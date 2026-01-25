import { useCallback, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const DineroDatePicker = ({
  label,
  value,
  onChange,
  placeholder = "DD/MM/AAAA",
  error,
}) => {
  const parseDateValue = useCallback((val) => {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val)) return val;
    if (typeof val === "string") {
      const iso = Date.parse(val);
      if (!Number.isNaN(iso)) return new Date(val);
      const m = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m) {
        const day = parseInt(m[1], 10);
        const month = parseInt(m[2], 10) - 1;
        const year = parseInt(m[3], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d)) return d;
      }
    }
    return null;
  }, []);

  const parsedValue = useMemo(
    () => parseDateValue(value),
    [value, parseDateValue],
  );

  const [visible, setVisible] = useState(false);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [displayDate, setDisplayDate] = useState(parsedValue || new Date());

  const scaleValue = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const yearListRef = useRef(null);

  useEffect(() => {
    if (yearPickerVisible && yearListRef.current) {
      const currentYearIndex = yearRange.findIndex(
        (y) => y === displayDate.getFullYear(),
      );
      if (currentYearIndex !== -1) {
        setTimeout(() => {
          yearListRef.current?.scrollToIndex({
            index: currentYearIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      }
    }
  }, [yearPickerVisible, yearRange, displayDate]);

  useEffect(() => {
    if (!visible) return;

    const newDate = parsedValue || new Date();
    const isSameDate = (d1, d2) =>
      d1 &&
      d2 &&
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    setDisplayDate((prev) => (isSameDate(prev, newDate) ? prev : newDate));
  }, [parsedValue, visible]);

  const animatePress = useCallback(() => {
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
  }, [scaleValue]);

  const openModal = useCallback(() => {
    animatePress();
    setVisible(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [animatePress, slideAnim]);

  const closeModal = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }, [slideAnim]);

  const handleDayPress = useCallback(
    (day) => {
      const newDate = new Date(
        displayDate.getFullYear(),
        displayDate.getMonth(),
        day,
      );
      onChange(newDate);
      closeModal();
    },
    [displayDate, onChange, closeModal],
  );

  const changeMonth = useCallback(
    (increment) => {
      const newDate = new Date(
        displayDate.getFullYear(),
        displayDate.getMonth() + increment,
        1,
      );
      setDisplayDate(newDate);
    },
    [displayDate],
  );

  const changeYear = useCallback(
    (year) => {
      const newDate = new Date(year, displayDate.getMonth(), 1);
      setDisplayDate(newDate);
      setYearPickerVisible(false);
    },
    [displayDate],
  );

  const days = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const result = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let i = 1; i <= daysInMonth; i++) result.push(i);
    return result;
  }, [displayDate]);

  const formatDate = useCallback(
    (date) => {
      const d = parseDateValue(date);
      if (!d) return null;
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    },
    [parseDateValue],
  );

  const yearRange = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      years.push(i);
    }
    return years;
  }, []);

  const borderColor = error ? "#FF4B4B" : "#E5E5E5";

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      )}

      <TouchableOpacity activeOpacity={1} onPress={openModal}>
        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ scale: scaleValue }], borderColor },
          ]}
        >
          <Text style={[styles.inputText, !value && styles.placeholderText]}>
            {formatDate(value) || placeholder}
          </Text>
          <View style={styles.iconContainer}>
            <EvilIcons name="calendar" size={38} color={THEME.text} />
          </View>
        </Animated.View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

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
                      outputRange: [600, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                style={styles.navButton}
                activeOpacity={0.75}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Mês anterior"
              >
                <Feather name="chevron-left" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setYearPickerVisible(true)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Selecionar ano"
              >
                <Text style={styles.monthTitle}>
                  {displayDate.toLocaleDateString("pt-BR", {
                    month: "long",
                  })}{" "}
                  <Text style={styles.yearText}>
                    {displayDate.getFullYear()}
                  </Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => changeMonth(1)}
                style={styles.navButton}
                activeOpacity={0.75}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Próximo mês"
              >
                <Feather name="chevron-right" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                <Text key={i} style={styles.weekDayText}>
                  {d}
                </Text>
              ))}
            </View>

            <FlatList
              data={days}
              numColumns={7}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                if (!item) return <View style={styles.dayCell} />;

                const isSelected =
                  parsedValue &&
                  item === parsedValue.getDate() &&
                  displayDate.getMonth() === parsedValue.getMonth() &&
                  displayDate.getFullYear() === parsedValue.getFullYear();

                return (
                  <TouchableOpacity
                    style={[styles.dayCell, isSelected && styles.selectedDay]}
                    onPress={() => handleDayPress(item)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>CANCELAR</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <Modal transparent visible={yearPickerVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setYearPickerVisible(false)}
          />
          <View style={styles.yearPickerContent}>
            <Text style={styles.yearPickerTitle}>Selecione o Ano</Text>
            <FlatList
              data={yearRange}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.yearListContainer}
              renderItem={({ item }) => {
                const isSelected = item === displayDate.getFullYear();
                return (
                  <TouchableOpacity
                    style={[
                      styles.yearItem,
                      isSelected && styles.selectedYearItem,
                    ]}
                    onPress={() => changeYear(item)}
                  >
                    <Text
                      style={[
                        styles.yearItemText,
                        isSelected && styles.selectedYearItemText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10, width: "100%" },
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4B4B4B",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  labelError: { color: "#FF4B4B" },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 16,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  inputText: { fontSize: 18, color: "#4B4B4B", fontWeight: "600" },
  placeholderText: { color: "#AFAFAF" },
  iconContainer: {
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  iconText: { fontSize: 20 },
  errorText: {
    color: "#FF4B4B",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B4B4B",
    textTransform: "capitalize",
  },
  yearText: {
    color: "#71ff6c",
    textDecorationLine: "underline",
  },
  navButton: {
    backgroundColor: THEME.accent,
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  navText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#AFAFAF",
  },
  dayCell: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 12,
  },
  dayText: { fontSize: 16, fontWeight: "600", color: "#4B4B4B" },
  selectedDay: { backgroundColor: "#71ff6c" },
  selectedDayText: { color: "white", fontWeight: "bold" },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderBottomWidth: 4,
    borderRadius: 12,
    width: "100%",
    height: 56,
    paddingVertical: 0,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontWeight: "bold",
    color: "#AFAFAF",
    fontSize: 18,
    textAlign: "center",
  },
  yearPickerContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    maxHeight: "70%",
    width: "80%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  yearPickerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B4B4B",
    marginBottom: 15,
    textAlign: "center",
  },
  yearListContainer: {
    paddingVertical: 8,
  },
  yearItem: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: "#F7F7F7",
    height: 56,
    justifyContent: "center",
  },
  selectedYearItem: {
    backgroundColor: "#71ff6c",
  },
  yearItemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B4B4B",
    textAlign: "center",
  },
  selectedYearItemText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DineroDatePicker;
