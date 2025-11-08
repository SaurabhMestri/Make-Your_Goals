import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Button,
} from "react-native";

function GoalInput({
  enteredText,
  setEnteredText,
  onAddGoal,
  editIndex,
  modelIsVisible,
  onCancel,
}) {
  return (
    <Modal transparent={true} visible={modelIsVisible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.inputText}
            placeholder="Enter your goals"
            value={enteredText}
            onChangeText={setEnteredText}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: editIndex !== null ? "#FFA500" : "#007BFF" },
            ]}
            onPress={onAddGoal}
          >
            <Text style={styles.addButtonText}>
              {editIndex !== null ? "Update Goal" : "Add Goal"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} style={styles.addButton}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default GoalInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    height: 200,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },

  inputText: { padding: 10 },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  model: {
    height: 10,
  },
});
