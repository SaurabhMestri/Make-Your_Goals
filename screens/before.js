import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SimpleGoalScreen() {
  const [enteredText, setEnteredText] = useState("");
  const [goals, setGoals] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Make Your Goal 🚀</Text>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={80}
      >
        <View style={styles.appContainer}>
          {/* Input Section */}
          <View style={styles.container}>
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
              onPress={addGoalHandler}
            >
              <Text style={styles.addButtonText}>
                {editIndex !== null ? "Update Goal" : "Add Goal"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable List */}
          <View style={styles.listContainer}>
            <FlatList
              data={goals}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listText}>{item.text}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => editGoal(index)}
                    >
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteGoalHandler(index)}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>

          {/* Footer */}
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
    // <View style={styles.appContainer}>
    //   <View style={styles.container}>
    //     <TextInput
    //       style={styles.inputText}
    //       placeholder="Your goals"
    //       value={enteredText}
    //       onChangeText={setEnteredText}
    //     />
    //     <TouchableOpacity onPress={addGoalHandler}>
    //       <Text style={styles.addButton}>
    //         {editIndex !== null ? "Update Goal" : "Add Goal"}
    //       </Text>
    //     </TouchableOpacity>
    //   </View>

    //   <View style={styles.listContainer}>
    //     <Text style={styles.heading}>Your Goals:</Text>

    //     <FlatList
    //       data={goals}
    //       keyExtractor={(item) => item.id}
    //       renderItem={({ item, index }) => (
    //         <View style={styles.listItem}>
    //           <Text style={styles.listText}>{item.text}</Text>
    //           <View style={styles.actions}>
    //             <TouchableOpacity
    //               style={styles.editButton}
    //               onPress={() => editGoal(index)}
    //             >
    //               <Text style={styles.actionText}>Edit</Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity
    //               style={styles.deleteButton}
    //               onPress={() => deleteGoalHandler(index)}
    //             >
    //               <Text style={styles.deleteText}>Delete</Text>
    //             </TouchableOpacity>
    //           </View>
    //         </View>
    //       )}
    //     />
    //   </View>

    //   <KeyboardAvoidingView behavior="padding">
    //     <View style={styles.footer}>
    //       <Button
    //         color="#ff0000ff"
    //         title="Clear All Fields"
    //         onPress={clearAllGoalsHandler}
    //       />
    //     </View>
    //   </KeyboardAvoidingView>
    // </View>
  );
}

const styles = StyleSheet.create({
  // appContainer: {
  //   flex: 1,
  //   paddingTop: 50,
  //   paddingHorizontal: 20,
  //   backgroundColor: "#fff",
  // },
  // container: {
  //   justifyContent: "space-between",
  //   gap: 10,
  // },
  // inputText: {
  //   padding: 10,
  //   borderWidth: 1,
  //   borderRadius: 5,
  // },
  // addButton: {
  //   padding: 12,
  //   backgroundColor: "blue",
  //   alignItems: "center",
  //   textAlign: "center",
  //   color: "#fff",
  //   fontWeight: 600,
  //   fontSize: 16,
  // },
  // listContainer: {
  //   flex: 1,
  //   marginTop: 20,
  // },
  // heading: {
  //   fontSize: 18,
  //   fontWeight: "600",
  //   marginBottom: 10,
  // },
  // listItem: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   backgroundColor: "#f0f0edff",
  //   padding: 12,
  //   borderRadius: 5,
  //   marginVertical: 5,
  // },
  // listText: {
  //   color: "#000000ff",
  // },
  // footer: { marginBottom: 5 },
  // deleteText: {
  //   color: "#ff0000ff",
  //   fontWeight: "600",
  // },
  // actions: {
  //   flexDirection: "row",
  //   gap: 10,
  // },
  // actionText: {
  //   color: "#333",
  //   fontWeight: "600",
  // },

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    marginTop: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 600,
    paddingVertical: 5,
  },
  inputText: {
    padding: 10,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  listText: {
    flex: 1,
    color: "#000",
    fontWeight: 500,
    fontSize: 15,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  deleteText: {
    color: "red",
    fontWeight: "600",
  },
  footer: {
    marginBottom: 10,
  },
});
