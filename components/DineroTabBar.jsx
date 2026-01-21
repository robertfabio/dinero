import * as LucideIcons from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  primary: "#71ff6c",
  inactive: "#9E9E9E",
};

export default function DineroTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(0)),
  ).current;

  const slideAnim = useRef(new Animated.Value(state.index)).current;

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
    inputRange: [0, 1, 2],
    outputRange: [4, 58, 112],
  });

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <Animated.View
        style={[
          styles.slidingBackground,
          {
            transform: [{ translateX }],
          },
        ]}
      />
      <View style={styles.backgroundBar} />
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
        if (route.name === "index") IconComponent = LucideIcons.Home;
        else if (route.name === "add-transaction")
          IconComponent = LucideIcons.DollarSign;
        else if (route.name === "summary")
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
    maxWidth: 180,
    width: 180,
    justifyContent: "center",
  },
  backgroundBar: {
    position: "absolute",
    left: 4,
    right: 4,
    top: 18,
    height: 56,
    backgroundColor: "rgb(37, 37, 37)",
    borderRadius: 28,
    elevation: 2,
  },
  slidingBackground: {
    position: "absolute",
    left: 4,
    top: 18,
    width: 56,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    zIndex: 1,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    marginTop: 10,
    zIndex: 2,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
  },
});
