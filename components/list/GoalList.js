import { FlatList, StyleSheet, View } from "react-native";
import GoalItem from "../item/GoalItem";

function GoalList({ goals, onEdit, onDelete }) {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <GoalItem
            item={item}
            onEdit={() => onEdit(index)}
            onDelete={() => onDelete(index)}
          />
        )}
      />
    </View>
  );
}

export default GoalList;

const styles = StyleSheet.create({
  listContainer: { flex: 1, marginTop: 20 },
});
