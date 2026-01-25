import {
    Canvas,
    Circle,
    Group,
    Path,
    Skia,
    Text,
    useFont,
} from "@shopify/react-native-skia";
import { useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { COLORS } from "../styles/globalStyles";

const { width: screenWidth } = Dimensions.get("window");
const chartSize = Math.min(screenWidth * 0.6, 200);
const radius = chartSize / 2 - 20;
const centerX = chartSize / 2;
const centerY = chartSize / 2;

export default function SkiaChart({ data, colors }) {
  const font = useFont(require("../assets/fonts/Inter-Medium.ttf"), 12);

  const { arcs, total } = useMemo(() => {
    const chartData = Array.isArray(data) ? data : [];
    const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);

    if (total === 0) {
      return { arcs: [], total: 0 };
    }

    let currentAngle = -Math.PI / 2; // Start at top
    const arcs = chartData.map((item, index) => {
      const percentage = (item.value || 0) / total;
      const angle = percentage * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Calculate arc path
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      const startX = centerX + radius * Math.cos(startAngle);
      const startY = centerY + radius * Math.sin(startAngle);
      const endX = centerX + radius * Math.cos(endAngle);
      const endY = centerY + radius * Math.sin(endAngle);

      const pathString = [
        `M ${centerX} ${centerY}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        "Z",
      ].join(" ");

      const path = Skia.Path.MakeFromSVGString(pathString);

      currentAngle = endAngle;

      return {
        path,
        color: colors[index % colors.length],
        percentage,
        label: item.category || item.label || `Item ${index + 1}`,
        value: item.value || 0,
      };
    });

    return { arcs, total };
  }, [data, colors]);

  const renderArc = useCallback(
    (arc, index) => (
      <Path key={index} path={arc.path} color={arc.color} style="fill" />
    ),
    [],
  );

  const renderCenterText = useCallback(() => {
    if (!font) return null;

    return (
      <Group>
        <Text
          x={centerX}
          y={centerY - 8}
          text="Total"
          font={font}
          color={COLORS.textLight}
          style="fill"
        />
        <Text
          x={centerX}
          y={centerY + 8}
          text={total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
          })}
          font={font}
          color={COLORS.text}
          style="fill"
        />
      </Group>
    );
  }, [font, total]);

  if (!data || data.length === 0 || total === 0) {
    return (
      <View style={styles.container}>
        <Canvas style={styles.canvas}>
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius}
            color={COLORS.neutral}
            style="stroke"
            strokeWidth={2}
          />
          {font && (
            <Text
              x={centerX}
              y={centerY}
              text="Sem dados"
              font={font}
              color={COLORS.textLight}
              style="fill"
            />
          )}
        </Canvas>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Group>
          {arcs.map(renderArc)}
          {renderCenterText()}
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    width: chartSize,
    height: chartSize,
  },
});
