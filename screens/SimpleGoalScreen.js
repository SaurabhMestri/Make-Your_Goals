import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function SimpleGoalScreen() {
  const [goals, setGoals] = useState([]);
  const [text, setText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  // ✅ Load saved goals
  useEffect(() => {
    AsyncStorage.getItem("simpleGoals").then((data) => {
      if (data) setGoals(JSON.parse(data));
    });
  }, []);

  // ✅ Save goals when updated
  useEffect(() => {
    AsyncStorage.setItem("simpleGoals", JSON.stringify(goals));
  }, [goals]);

  // ✅ Handlers for calendar picker
  const showDatePicker = () => setPickerVisible(true);
  const hideDatePicker = () => setPickerVisible(false);
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  // ✅ Add new goal
  const addGoal = () => {
    if (text.trim() === "" || !selectedDate) return;

    const newGoal = {
      id: Date.now().toString(),
      text,
      date: selectedDate.toISOString(),
    };

    setGoals((prev) => [...prev, newGoal]);
    setText("");
    setSelectedDate(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎯 Add Your Goal</Text>

      <TextInput
        placeholder="Enter goal..."
        style={styles.input}
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>
          {selectedDate ? selectedDate.toDateString() : "Select Date 📆"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity style={styles.button} onPress={addGoal}>
        <Text style={styles.buttonText}>Add Goal</Text>
      </TouchableOpacity>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.dateText}>
              📅 {new Date(item.date).toDateString()}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  dateButton: {
    backgroundColor: "#E0E0E0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  dateButtonText: { color: "#333", fontWeight: "600" },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  itemText: { color: "#333", fontWeight: "bold" },
  dateText: { color: "#777", fontSize: 13, marginTop: 4 },
});
