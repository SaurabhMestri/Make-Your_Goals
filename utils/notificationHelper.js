import * as Notifications from "expo-notifications";

// One-time alarm
export const scheduleGoalNotification = async (goalText, date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🎯 Goal Reminder",
      body: `It's time to start: ${goalText}`,
      sound: "default",
    },
    trigger: new Date(date), // JS Date object
  });
};

// Daily repeating alarm
export const scheduleDailyGoalNotification = async (goalText, hour, minute) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🔥 Daily Goal Reminder",
      body: `Start your goal: ${goalText}`,
      sound: "default",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
};
