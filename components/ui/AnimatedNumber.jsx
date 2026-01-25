import { useEffect, useState } from "react";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function AnimatedNumber({
  value,
  style,
  prefix = "",
  suffix = "",
  duration = 600,
  decimals = 2,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 120,
    });

    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuart)
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  }, [opacity, scale]);

  const formattedValue =
    typeof displayValue === "number"
      ? displayValue.toLocaleString("pt-BR", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : displayValue;

  return (
    <Animated.View style={animatedStyle}>
      <Text style={style}>
        {prefix}
        {formattedValue}
        {suffix}
      </Text>
    </Animated.View>
  );
}
