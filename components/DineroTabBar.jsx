import * as LucideIcons from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  primary: "#71ff6c",
  inactive: "#9E9E9E",
};

const TAB_BUTTON_SIZE = 56;
const SPACING = 4;

const SPRING_CONFIG = {
  damping: 200,
  stiffness: 5000,
};

function TabIcon({ routeName, isFocused }) {
  let IconComponent;
  if (routeName === "home") IconComponent = LucideIcons.Home;
  else if (routeName === "transactions") IconComponent = LucideIcons.DollarSign;
  else if (routeName === "sumary") IconComponent = LucideIcons.ScrollText;
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
      `DineroTabBar: missing icon for route "${routeName}", using fallback.`,
    );
  }

  const progress = useDerivedValue(() => {
    return withSpring(isFocused ? 1 : 0, SPRING_CONFIG);
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0.5, 1]),
      transform: [{ scale: interpolate(progress.value, [0, 0.5], [1, 1.1]) }],
    };
  });

  return (
    <Animated.View style={[styles.iconWrapper, animatedStyle]}>
      <IconComponent
        size={24}
        color={isFocused ? COLORS.primary : COLORS.inactive}
        strokeWidth={isFocused ? 2.5 : 2}
      />
    </Animated.View>
  );
}

export default function DineroTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const routeCount = state.routes.length;

  const tabBarWidth = useMemo(() => {
    return routeCount * TAB_BUTTON_SIZE + SPACING * 2;
  }, [routeCount]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(state.index * TAB_BUTTON_SIZE, SPRING_CONFIG),
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, 8), width: tabBarWidth },
      ]}
    >
      <Animated.View style={[styles.slidingBackground, indicatorStyle]} />
      <View
        style={[styles.backgroundBar, { width: tabBarWidth - SPACING * 2 }]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

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
            <TabIcon routeName={route.name} isFocused={isFocused} />
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
