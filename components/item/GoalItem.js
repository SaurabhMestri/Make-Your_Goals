import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function GoalItem({ item, onDelete, onEdit }) {
  const isExpired = new Date(item.endDate) < new Date();

  return (
    <View style={styles.goalItem}>
      <TouchableOpacity onPress={onEdit} style={{ flex: 1 }}>
        <Text
          style={[
            styles.goalText,
            isExpired && styles.expiredText, // 👈 underline-through expired
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item.startDate).toDateString()} →{" "}
          {new Date(item.endDate).toDateString()}
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "500",
  },
  expiredText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  editText: {
    fontSize: 18,
    color: "#007bff",
  },
  deleteText: {
    fontSize: 18,
    color: "#ff3333",
  },
});
