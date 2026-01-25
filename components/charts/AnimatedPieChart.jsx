import { Canvas, Path, Skia, Text, useFont } from "@shopify/react-native-skia";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Text as RNText, View } from "react-native";
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../styles/globalStyles";

const { width: screenWidth } = Dimensions.get("window");

export default function AnimatedPieChart({
  data,
  size = Math.min(screenWidth * 0.6, 200),
}) {
  const progress = useSharedValue(0);
  const [opacity, setOpacity] = useState(0);
  const font = useFont(require("../assets/fonts/Inter-Medium.ttf"), 12);

  const chartData = useMemo(() => {
    return Array.isArray(data) ? data.filter((item) => item.value > 0) : [];
  }, [data]);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      runOnJS(setOpacity)(value);
    },
  );

  useEffect(() => {
    if (chartData.length > 0) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 1200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [chartData, progress]);

  const { total, paths } = useMemo(() => {
    if (!chartData.length) return { total: 0, paths: [] };

    const total = chartData.reduce(
      (sum, item) => sum + (item.value || item.population || 0),
      0,
    );
    if (total === 0) return { total: 0, paths: [] };

    let currentAngle = -Math.PI / 2;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 20;

    const paths = chartData.map((item, index) => {
      const value = item.value || item.population || 0;
      const percentage = value / total;
      const sweepAngle = percentage * 2 * Math.PI;

      const path = Skia.Path.Make();
      path.moveTo(cx, cy);

      const startX = cx + radius * Math.cos(currentAngle);
      const startY = cy + radius * Math.sin(currentAngle);
      path.lineTo(startX, startY);

      path.addArc(
        {
          x: cx - radius,
          y: cy - radius,
          width: radius * 2,
          height: radius * 2,
        },
        (currentAngle * 180) / Math.PI,
        (sweepAngle * 180) / Math.PI,
      );

      path.close();
      currentAngle += sweepAngle;

      return {
        path,
        color: item.color || COLORS.primary,
        name: item.name || item.category || `Item ${index + 1}`,
        value,
        percentage: (percentage * 100).toFixed(1),
      };
    });

    return { total, paths };
  }, [chartData, size]);

  if (!chartData.length || total === 0) {
    return (
      <View
        style={{ alignItems: "center", justifyContent: "center", height: size }}
      >
        <RNText style={{ color: COLORS.textLight, fontSize: 16 }}>
          Nenhum dado disponível
        </RNText>
      </View>
    );
  }

  return (
    <View style={{ alignItems: "center" }}>
      <Canvas style={{ width: size, height: size }}>
        {paths.map((item, index) => (
          <Path
            key={index}
            path={item.path}
            color={item.color}
            opacity={opacity}
            style="fill"
          />
        ))}

        {/* Center text */}
        {font && (
          <>
            <Text
              x={size / 2}
              y={size / 2 - 8}
              text="Total"
              font={font}
              color={COLORS.textLight}
              style="fill"
            />
            <Text
              x={size / 2}
              y={size / 2 + 8}
              text={total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
              })}
              font={font}
              color={COLORS.text}
              style="fill"
            />
          </>
        )}
      </Canvas>

      <View style={{ marginTop: 16, width: "100%" }}>
        {paths.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: item.color,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: COLORS.text,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "800",
                color: COLORS.text,
                marginLeft: 8,
              }}
            >
              {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
