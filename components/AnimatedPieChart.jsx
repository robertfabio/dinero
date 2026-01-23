import {
    Canvas,
    Easing,
    Path,
    runTiming,
    Skia,
    useValue,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { COLORS } from "../styles/globalStyles";

export default function AnimatedPieChart({ data, size = 200 }) {
  const progress = useValue(0);

  useEffect(() => {
    runTiming(progress, 1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [data, progress]);

  const total = data.reduce((sum, item) => sum + item.population, 0);
  let currentAngle = -Math.PI / 2; 

  const paths = data.map((item, index) => {
    const percentage = item.population / total;
    const sweepAngle = percentage * 2 * Math.PI;
    const path = Skia.Path.Make();

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 10;

    path.moveTo(cx, cy);

    const startX = cx + radius * Math.cos(currentAngle);
    const startY = cy + radius * Math.sin(currentAngle);
    path.lineTo(startX, startY);

    const endAngle = currentAngle + sweepAngle;
    path.addArc(
      { x: cx - radius, y: cy - radius, width: radius * 2, height: radius * 2 },
      (currentAngle * 180) / Math.PI,
      (sweepAngle * 180) / Math.PI,
    );

    path.close();
    currentAngle = endAngle;

    return {
      path,
      color: item.color,
      name: item.name,
      value: item.population,
      percentage: (percentage * 100).toFixed(1),
    };
  });

  return (
    <View style={{ alignItems: "center" }}>
      <Canvas style={{ width: size, height: size }}>
        {paths.map((item, index) => (
          <Path
            key={index}
            path={item.path}
            color={item.color}
            opacity={progress}
            style="fill"
          />
        ))}
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
