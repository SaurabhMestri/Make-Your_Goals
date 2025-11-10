import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import GoalInput from "./components/input/GoalInput";
import GoalList from "./components/list/GoalList";

export default function SimpleGoalScreen() {
  const [enteredText, setEnteredText] = useState("");
  const [goals, setGoals] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modelIsVisible, setModelIsVisible] = useState(false);
  const [activeGoals, setActiveGoals] = useState([]);
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  // ✅ Load goals from AsyncStorage
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const storedGoals = await AsyncStorage.getItem("goals");
        if (storedGoals) {
          const parsedGoals = JSON.parse(storedGoals);
          setGoals(parsedGoals);
          checkUnexpiredGoals(parsedGoals);
        }
      } catch (error) {
        console.log("Error loading goals:", error);
      }
    };
    loadGoals();
  }, []);

  // ✅ Save goals automatically
  useEffect(() => {
    AsyncStorage.setItem("goals", JSON.stringify(goals)).catch((err) =>
      console.log("Error saving goals:", err)
    );
  }, [goals]);

  // ✅ Function to check active goals
  function checkUnexpiredGoals(allGoals) {
    const now = new Date();
    const validGoals = allGoals.filter((g) => new Date(g.endDate) > now);

    if (validGoals.length > 0) {
      setActiveGoals(validGoals);
      setAlertModalVisible(true);
    }
  }

  // ✅ Add or Update Goal
  async function addGoalHandler(goalData) {
    const newGoal = {
      id: Date.now().toString(),
      text: goalData.text,
      startDate: goalData.startDate,
      endDate: goalData.endDate,
    };

    if (editIndex !== null) {
      const updated = [...goals];
      updated[editIndex] = newGoal;
      setGoals(updated);
      setEditIndex(null);
    } else {
      setGoals((prev) => [...prev, newGoal]);
    }

    setEnteredText("");
    endAddGoal();
  }

  function startAddGoal() {
    setModelIsVisible(true);
  }

  function endAddGoal() {
    setModelIsVisible(false);
    setEnteredText("");
    setEditIndex(null);
  }

  // ✅ Edit Goal
  function editGoal(index) {
    setEnteredText(goals[index].text);
    setEditIndex(index);
    setModelIsVisible(true);
  }

  // ✅ Delete Goal
  function deleteGoalHandler(index) {
    Alert.alert("Delete", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          const updated = goals.filter((_, i) => i !== index);
          setGoals(updated);
          await AsyncStorage.setItem("goals", JSON.stringify(updated));
        },
      },
    ]);
  }

  // ✅ Auto line-through expired goals
  const updatedGoals = goals.map((goal) => {
    const isExpired = new Date(goal.endDate) < new Date();
    return { ...goal, expired: isExpired };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>🎯 Make Your Goal</Text>

      {/* ✅ Alert Modal for Active Goals */}
      <Modal visible={alertModalVisible} transparent animationType="fade">
        <BlurView intensity={100} tint="dark" style={styles.blurOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Active Goals Reminder</Text>

            <ScrollView style={{ maxHeight: 250 }}>
              {activeGoals.map((goal) => (
                <View key={goal.id} style={styles.alertItem}>
                  <Text style={styles.alertGoal}>{goal.text}</Text>
                  <Text style={styles.alertDate}>
                    🗓 {new Date(goal.startDate).toDateString()} →{" "}
                    {new Date(goal.endDate).toDateString()}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setAlertModalVisible(false)}
              style={styles.okButton}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <View style={styles.appContainer}>
          <Button
            title="Add New Goal"
            color={"#5e0acc"}
            onPress={startAddGoal}
          />

          {/* Add/Edit Goal */}
          <GoalInput
            enteredText={enteredText}
            setEnteredText={setEnteredText}
            onAddGoal={addGoalHandler}
            editIndex={editIndex}
            modelIsVisible={modelIsVisible}
            onCancel={endAddGoal}
            existingGoal={editIndex !== null ? goals[editIndex] : null}
          />

          {/* Goal List */}
          <GoalList
            goals={updatedGoals}
            onEdit={editGoal}
            onDelete={deleteGoalHandler}
          />

          <View style={styles.footer}>
            <Button
              color="#ff0000"
              title="Clear All Goals"
              onPress={() => {
                Alert.alert("Clear All", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Yes",
                    style: "destructive",
                    onPress: async () => {
                      await AsyncStorage.removeItem("goals");
                      setGoals([]);
                    },
                  },
                ]);
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  appContainer: { flex: 1, paddingHorizontal: 20 },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    paddingVertical: 10,
  },
  footer: { marginTop: 10 },

  // ✅ Alert Modal Styles

  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  alertGoal: {
    fontSize: 20,
    fontWeight: "500",
  },
  alertDate: {
    fontSize: 14,
    color: "#666",
  },
  okButton: {
    backgroundColor: "#5e0acc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  okText: {
    color: "#fff",
    fontWeight: "bold",
  },
  blurOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "rgba(211, 208, 208, 0.5)",
    borderRadius: 20,
    width: "85%",
    padding: 40,
    alignItems: "center",
    shadowColor: "#2c2c2cff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
});
