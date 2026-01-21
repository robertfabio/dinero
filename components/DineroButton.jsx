import { useImperativeHandle, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import MoneyExplosion from "./MoneyExplosion";

const DineroButton = (
  {
    title,
    onPress,
    style,
    textStyle,
    useParticles = true,
    initialFaceColor = "#71ff6c",
    initialShadowColor = "#5bfc55",
    initialTextColor = "#FFF",
  },
  ref,
) => {
  const pressAnim = useRef(new Animated.Value(1)).current;
  const explosionRef = useRef(null);

  const [faceColor, setFaceColor] = useState(initialFaceColor);
  const [shadowColor, setShadowColor] = useState(initialShadowColor);
  const [textColor, setTextColor] = useState(initialTextColor);

  useImperativeHandle(ref, () => ({
    setFaceColor,
    setShadowColor,
    setTextColor,
    setColors: ({ face, shadow, text }) => {
      if (face) setFaceColor(face);
      if (shadow) setShadowColor(shadow);
      if (text) setTextColor(text);
    },
    getColors: () => ({
      face: faceColor,
      shadow: shadowColor,
      text: textColor,
    }),
    triggerExplosion: () => {
      if (useParticles) explosionRef.current?.trigger?.();
    },
  }));

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = (e) => {
    triggerExplosion();
    if (onPress) onPress(e);
  };

  const translateY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const flatStyle = StyleSheet.flatten(style) || {};
  const { borderRadius } = flatStyle;

  const triggerExplosion = () => {
    if (!useParticles) return;
    explosionRef.current?.trigger?.();
  };

  return (
    <View style={styles.wrapper}>
      {useParticles && <MoneyExplosion ref={explosionRef} />}

      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, style]}
      >
        <View
          style={[
            styles.shadowLayer,
            borderRadius ? { borderRadius } : null,
            { backgroundColor: shadowColor },
          ]}
        />
        <Animated.View
          style={[
            styles.faceLayer,
            borderRadius ? { borderRadius } : null,
            { transform: [{ translateY }], backgroundColor: faceColor },
          ]}
        >
          <Text style={[styles.text, textStyle, { color: textColor }]}>
            {title}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  container: {
    width: 350,
    height: 65,
    alignSelf: "center",
    justifyContent: "flex-end",
  },
  shadowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    top: 6,
  },
  faceLayer: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
  },
  text: {
    fontWeight: "900",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 1,
  },
  particleOrigin: {
    position: "absolute",
    top: 0,
    left: "50%",
    zIndex: 0,
  },
  particle: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  moneyText: {
    fontSize: 24,
  },
});

export default DineroButton;
