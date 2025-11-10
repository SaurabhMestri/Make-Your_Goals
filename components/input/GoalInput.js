import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Button,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function GoalInput({
  enteredText,
  setEnteredText,
  onAddGoal,
  editIndex,
  modelIsVisible,
  onCancel,
  existingGoal, // 👈 pass this when editing
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // ✅ Load existing goal dates when editing
  useEffect(() => {
    if (existingGoal) {
      if (existingGoal.startDate) {
        setStartDate(new Date(existingGoal.startDate));
      }
      if (existingGoal.endDate) {
        setEndDate(new Date(existingGoal.endDate));
      }
    }
  }, [existingGoal]);

  const handleAddGoal = () => {
    if (!enteredText.trim()) return;
    onAddGoal({
      text: enteredText,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  return (
    <Modal transparent visible={modelIsVisible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {editIndex !== null ? "Edit Goal" : "Add New Goal"}
          </Text>

          {/* Input */}
          <TextInput
            style={styles.inputText}
            placeholder="Enter your goal..."
            value={enteredText}
            onChangeText={setEnteredText}
          />

          {/* Start Date */}
          <Text style={styles.label}>Start Date:</Text>
          <Button
            title={startDate.toDateString()}
            onPress={() => setShowStartPicker(true)}
          />
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setStartDate(date);
              }}
            />
          )}

          {/* End Date */}
          <Text style={styles.label}>End Date:</Text>
          <Button
            title={endDate.toDateString()}
            onPress={() => setShowEndPicker(true)}
          />
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}

          {/* Add / Update Button */}
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: editIndex !== null ? "#FFA500" : "#007BFF" },
            ]}
            onPress={handleAddGoal}
          >
            <Text style={styles.addButtonText}>
              {editIndex !== null ? "Update Goal" : "Add Goal"}
            </Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputText: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#ccc",
  },
  cancelText: {
    color: "#000",
    fontWeight: "bold",
  },
});
