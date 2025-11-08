import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Configure notification behavior (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function TimedGoalScreen() {
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);

  // ✅ Ask for notification permission on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Enable notifications to get reminders!"
        );
      }

      // ✅ Android channel setup
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    };

    setupNotifications();
  }, []);

  // ✅ Load saved goals
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await AsyncStorage.getItem("timedGoals");
        if (data) setGoals(JSON.parse(data));
      } catch (error) {
        console.log("Error loading goals:", error);
      }
    };
    loadGoals();
  }, []);

  // ✅ Save whenever goals change
  useEffect(() => {
    AsyncStorage.setItem("timedGoals", JSON.stringify(goals));
  }, [goals]);

  // Calendar handlers
  const showDatePicker = () => setPickerVisible(true);
  const hideDatePicker = () => setPickerVisible(false);
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  // ✅ Schedule notification
  const scheduleNotification = async (goalText, date) => {
    const now = new Date();
    if (date <= now) return; // skip past dates

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Goal Time Expired ⏰",
        body: `Your goal "${goalText}" date has passed!`,
      },
      trigger: { date }, // ✅ correct trigger format
    });
  };

  // ✅ Add new goal
  const addGoal = async () => {
    if (!goalText.trim() || !selectedDate || !duration.trim()) {
      Alert.alert("Missing Info", "Please fill all fields!");
      return;
    }

    const goal = {
      id: Date.now().toString(),
      text: goalText,
      date: selectedDate.toISOString(), // ✅ store as string
      duration,
    };

    setGoals((prev) => [...prev, goal]);
    await scheduleNotification(goalText, selectedDate);

    setGoalText("");
    setSelectedDate(null);
    setDuration("");
  };

  // ✅ Delete goal
  const deleteGoal = async (id) => {
    Alert.alert("Delete Goal", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          const updated = goals.filter((g) => g.id !== id);
          setGoals(updated);
          await AsyncStorage.setItem("timedGoals", JSON.stringify(updated));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📅 Add Timed Goal</Text>

      <TextInput
        placeholder="Enter goal..."
        style={styles.input}
        value={goalText}
        onChangeText={setGoalText}
      />

      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>
          {selectedDate ? selectedDate.toDateString() : "Select Date 📆"}
        </Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Enter duration (e.g. 5 days)"
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
      />

      <TouchableOpacity style={styles.addButton} onPress={addGoal}>
        <Text style={styles.addButtonText}>Add Timed Goal</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.dateText}>
              ⏰ {new Date(item.date).toDateString()} — {item.duration}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteGoal(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
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
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#E0E0E0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: { color: "#333", fontWeight: "600" },
  addButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  item: {
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: { color: "#333", fontWeight: "600" },
  dateText: { color: "#777", fontSize: 13 },
  deleteButton: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#ffdddd",
    padding: 6,
    borderRadius: 6,
  },
  deleteText: { color: "red", fontWeight: "bold" },
});
