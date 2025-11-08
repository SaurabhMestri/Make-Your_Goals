import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoalInput from "./components/input/GoalInput";
import GoalList from "./components/list/GoalList";

export default function SimpleGoalScreen() {
  const [enteredText, setEnteredText] = useState("");
  const [goals, setGoals] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modelIsVisible, setModelIsVisible] = useState(false);

  function startAddGoal() {
    setModelIsVisible(true);
  }
  function endAddGoal() {
    setModelIsVisible(false);
  }

  // Load goals
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const storedGoals = await AsyncStorage.getItem("goals");
        if (storedGoals) setGoals(JSON.parse(storedGoals));
      } catch (error) {
        console.log("Error loading goals:", error);
      }
    };
    loadGoals();
  }, []);

  // Save goals automatically
  useEffect(() => {
    const saveGoals = async () => {
      try {
        await AsyncStorage.setItem("goals", JSON.stringify(goals));
      } catch (error) {
        console.log("Error saving goals:", error);
      }
    };
    saveGoals();
  }, [goals]);

  // Clear all goals
  async function clearAllGoalsHandler() {
    Alert.alert("Clear All Goals", "Are you sure you want to delete all?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("goals");
            setGoals([]);
          } catch (error) {
            console.log("Error clearing goals:", error);
          }
        },
      },
    ]);
  }

  function editGoal(index) {
    setEnteredText(goals[index].text);
    setEditIndex(index);
    startAddGoal();
  }

  async function deleteGoalHandler(index) {
    Alert.alert("Delete", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            const updated = goals.filter((_, i) => i !== index);
            setGoals(updated);
            await AsyncStorage.setItem("goals", JSON.stringify(updated));
          } catch (error) {
            console.log("Error deleting goal:", error);
          }
        },
      },
    ]);
  }

  function addGoalHandler() {
    if (enteredText.trim().length === 0) return;

    if (editIndex !== null) {
      // Update existing goal
      const updatedGoals = [...goals];
      updatedGoals[editIndex].text = enteredText;
      setGoals(updatedGoals);
      setEditIndex(null);
    } else {
      // Add new goal
      setGoals((currentGoals) => [
        ...currentGoals,
        { id: Date.now().toString(), text: enteredText },
      ]);
    }

    setEnteredText("");
    endAddGoal();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Make Your Goal 🚀</Text>
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
          {modelIsVisible && (
            <GoalInput
              enteredText={enteredText}
              setEnteredText={setEnteredText}
              onAddGoal={addGoalHandler}
              editIndex={editIndex}
              modelIsVisible={modelIsVisible}
              onCancel={endAddGoal}
            />
          )}
          <GoalList
            goals={goals}
            onEdit={editGoal}
            onDelete={deleteGoalHandler}
          />
          <View style={styles.footer}>
            <Button
              color="#ff0000"
              title="Clear All Goals"
              onPress={clearAllGoalsHandler}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 600,
    paddingVertical: 5,
  },

  footer: {},
});
