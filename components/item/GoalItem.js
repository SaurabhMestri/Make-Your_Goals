import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function GoalItem({ item, index, onEdit, onDelete }) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listText}>{item.text}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(index)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(index)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default GoalItem;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  listText: { flex: 1, color: "#000", fontWeight: "500", fontSize: 15 },
  actions: { flexDirection: "row", gap: 10 },
  deleteText: { color: "red", fontWeight: "600" },
});
