import React from "react";
import { StyleSheet, View } from "react-native";
import { METRICS } from "../../styles/globalStyles";

export const ResponsiveGrid = ({
  children,
  columns = 2,
  gap = METRICS.padding,
  style,
}) => {
  const itemsPerRow = columns;

  const gridChildren = React.Children.toArray(children).filter(Boolean);

  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < gridChildren.length; i += itemsPerRow) {
      const rowItems = gridChildren.slice(i, i + itemsPerRow);
      rows.push(
        <View key={i} style={[styles.row, { gap }]}>
          {rowItems.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.cell,
                {
                  flex: 1,
                  marginRight: idx === rowItems.length - 1 ? 0 : 0,
                },
              ]}
            >
              {item}
            </View>
          ))}
          {/* Fill empty spaces */}
          {rowItems.length < itemsPerRow &&
            Array.from({
              length: itemsPerRow - rowItems.length,
            }).map((_, idx) => (
              <View key={`empty-${idx}`} style={styles.cell} />
            ))}
        </View>,
      );
    }
    return rows;
  };

  return (
    <View style={[styles.container, style]}>
      {renderGrid().map((row) => row)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: METRICS.padding,
  },
  row: {
    flexDirection: "row",
    marginBottom: METRICS.padding,
  },
  cell: {
    flex: 1,
  },
});
