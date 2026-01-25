import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { THEME } from "../../styles/globalStyles";

const DineroInput = ({
  label,
  error,
  placeholder,
  value,
  onChangeText,
  inputHeight = 56,
  inputPadding = 0,
  containerStyle = {},
  inputStyle = {},
  labelFullWidth = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocused, focusAnim]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? "#FF4B4B" : "#E5E5E5",
      error ? "#FF4B4B" : THEME.accent,
    ],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F7F7F7", "#FFFFFF"],
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            labelFullWidth && styles.labelFullWidth,
            error && styles.labelError,
          ]}
        >
          {label}
        </Text>
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor,
            height: inputHeight,
          },
          containerStyle,
        ]}
      >
        <TextInput
          style={[styles.input, { paddingVertical: inputPadding }, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#AFAFAF"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={THEME.accent}
          {...props}
        />
      </Animated.View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4B4B4B",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  labelError: {
    color: "#FF4B4B",
  },
  labelFullWidth: {
    flexBasis: "100%",
  },
  inputContainer: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 18,
    color: "#4B4B4B",
    fontWeight: "600",
    height: "100%",
  },
  errorText: {
    color: "#FF4B4B",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
    marginLeft: 4,
  },
});

export default DineroInput;
