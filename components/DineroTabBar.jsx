import * as LucideIcons from "lucide-react-native";
import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  primary: "#71ff6c",
  inactive: "#9E9E9E",
};

const TAB_BUTTON_SIZE = 56;
const SPACING = 4;

export default function DineroTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const routeCount = state.routes.length;

  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(0)),
  ).current;

  const slideAnim = useRef(new Animated.Value(state.index)).current;

  const { tabBarWidth, inputRange, outputRange } = useMemo(() => {
    const width = routeCount * TAB_BUTTON_SIZE + SPACING * 2;
    const input = Array.from({ length: routeCount }, (_, i) => i);
    const output = Array.from(
      { length: routeCount },
      (_, i) => i * TAB_BUTTON_SIZE,
    );
    return { tabBarWidth: width, inputRange: input, outputRange: output };
  }, [routeCount]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: state.index,
        useNativeDriver: false,
        tension: 40,
        friction: 8,
      }),
      Animated.spring(animatedValues[state.index], {
        toValue: 1,
        useNativeDriver: false,
        tension: 40,
        friction: 8,
      }),
    ]).start();

    animatedValues.forEach((anim, index) => {
      if (index !== state.index) {
        Animated.spring(anim, {
          toValue: 0,
          useNativeDriver: false,
          tension: 40,
          friction: 8,
        }).start();
      }
    });
  }, [state.index, animatedValues, slideAnim]);

  const translateX = slideAnim.interpolate({
    inputRange,
    outputRange,
  });

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, 8), width: tabBarWidth },
      ]}
    >
      <Animated.View
        style={[
          styles.slidingBackground,
          {
            transform: [{ translateX }],
          },
        ]}
      />
      <View
        style={[styles.backgroundBar, { width: tabBarWidth - SPACING * 2 }]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const animValue = animatedValues[index];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let IconComponent;
        if (route.name === "home") IconComponent = LucideIcons.Home;
        else if (route.name === "add-transaction")
          IconComponent = LucideIcons.DollarSign;
        else if (route.name === "sumary")
          IconComponent = LucideIcons.ScrollText;
        else IconComponent = LucideIcons.ShoppingBag;

        if (!IconComponent) {
          const FallbackIcon = ({ size = 24, color = COLORS.inactive }) => (
            <View
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                opacity: 0.9,
              }}
            />
          );
          FallbackIcon.displayName = "DineroTabBarFallbackIcon";
          IconComponent = FallbackIcon;
          console.warn(
            `DineroTabBar: missing icon for route "${route.name}", using fallback.`,
          );
        }

        const scale = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        });

        const iconOpacity = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        });

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.iconWrapper,
                {
                  opacity: iconOpacity,
                  transform: [{ scale }],
                },
              ]}
            >
              <IconComponent
                size={24}
                color={isFocused ? COLORS.primary : COLORS.inactive}
                strokeWidth={isFocused ? 2.5 : 2}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingTop: 8,
    paddingHorizontal: SPACING,
    justifyContent: "flex-start",
  },
  backgroundBar: {
    position: "absolute",
    left: SPACING,
    right: SPACING,
    top: 18,
    height: TAB_BUTTON_SIZE,
    backgroundColor: "rgb(37, 37, 37)",
    borderRadius: TAB_BUTTON_SIZE / 2,
    elevation: 2,
  },
  slidingBackground: {
    position: "absolute",
    left: SPACING,
    top: 18,
    width: TAB_BUTTON_SIZE,
    height: TAB_BUTTON_SIZE,
    backgroundColor: "#FFFFFF",
    borderRadius: TAB_BUTTON_SIZE / 2,
    zIndex: 1,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: TAB_BUTTON_SIZE,
    height: TAB_BUTTON_SIZE,
    marginTop: 10,
    zIndex: 2,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: TAB_BUTTON_SIZE,
    height: TAB_BUTTON_SIZE,
  },
});
