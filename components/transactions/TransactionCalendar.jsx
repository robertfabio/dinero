import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, GlobalStyles } from "../../styles/globalStyles";

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function TransactionCalendar({ transactions }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month } = useMemo(
    () => ({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
    }),
    [currentDate],
  );

  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Dias vazios antes do primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;

      const dayTransactions = transactions.filter((t) => t.date === dateStr);

      const income = dayTransactions
        .filter((t) => ["income", "salary"].includes(t.category))
        .reduce((sum, t) => sum + t.value, 0);

      const expenses = dayTransactions
        .filter((t) => !["income", "salary"].includes(t.category))
        .reduce((sum, t) => sum + t.value, 0);

      days.push({
        day,
        date: dateStr,
        income,
        expenses,
        balance: income - expenses,
        count: dayTransactions.length,
      });
    }

    return days;
  }, [transactions, year, month]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <View style={[GlobalStyles.duoContainer, { padding: 16 }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.title}>Calendário de Transações</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={goToPreviousMonth} style={styles.navButton}>
          <MaterialIcons name="chevron-left" size={28} color={COLORS.text} />
        </Pressable>

        <Pressable onPress={goToToday} style={styles.monthLabel}>
          <Text style={styles.monthText}>
            {MONTHS[month]} {year}
          </Text>
        </Pressable>

        <Pressable onPress={goToNextMonth} style={styles.navButton}>
          <MaterialIcons name="chevron-right" size={28} color={COLORS.text} />
        </Pressable>
      </View>

      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {calendarData.map((dayData, index) => {
          if (!dayData) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const isToday =
            dayData.day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          const hasIncome = dayData.income > 0;
          const hasExpenses = dayData.expenses > 0;

          return (
            <View
              key={dayData.date}
              style={[
                styles.dayCell,
                isToday && styles.todayCell,
                dayData.count > 0 && styles.activeDayCell,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isToday && styles.todayText,
                  dayData.count > 0 && styles.activeDayText,
                ]}
              >
                {dayData.day}
              </Text>

              {dayData.count > 0 && (
                <View style={styles.indicators}>
                  {hasIncome && (
                    <View
                      style={[
                        styles.indicator,
                        { backgroundColor: COLORS.secondary },
                      ]}
                    />
                  )}
                  {hasExpenses && (
                    <View
                      style={[
                        styles.indicator,
                        { backgroundColor: COLORS.danger },
                      ]}
                    />
                  )}
                </View>
              )}

              {dayData.count > 0 && (
                <Text style={styles.transactionCount}>{dayData.count}</Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: COLORS.secondary }]}
          />
          <Text style={styles.legendText}>Receita</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: COLORS.danger }]}
          />
          <Text style={styles.legendText}>Despesa</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    textTransform: "uppercase",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    padding: 4,
  },
  monthLabel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    textTransform: "uppercase",
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textLight,
    textTransform: "uppercase",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  todayCell: {
    backgroundColor: "rgba(28, 176, 246, 0.1)",
    borderRadius: 8,
  },
  activeDayCell: {
    backgroundColor: "rgba(75, 75, 75, 0.03)",
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  todayText: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  activeDayText: {
    fontWeight: "700",
  },
  indicators: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  transactionCount: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textLight,
    marginTop: 1,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textLight,
  },
});
