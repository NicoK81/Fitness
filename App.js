// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AddExerciseScreen from './screens/AddExerciseScreen';
import ExerciseHistoryScreen from './screens/ExerciseHistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatBotScreen from './screens/ChatBotScreen';

import { WorkoutContext } from './screens/WorkoutContext';
import { LanguageContext } from './screens/LanguageContext';
import style from './Styles/style';

const Tab = createBottomTabNavigator();

export default function App() {
  // treenit
  const [workouts, setWorkouts] = useState([
    { sport: 'Running', distance: 5, duration: 30, date: new Date() },
    { sport: 'Cycling', distance: 15, duration: 60, date: new Date() },
    { sport: 'Swimming', distance: 1, duration: 20, date: new Date() },
    { sport: 'Walking', distance: 6, duration: 60, date: new Date() },
  ]);

  // km / miles
  const [unit, setUnit] = useState('km');

  // kieli: fi / en  👉 HUOM: TÄMÄ ON OIKEA MUOTO
  const [language, setLanguage] = useState('fi');

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <WorkoutContext.Provider value={{ workouts, setWorkouts, unit, setUnit }}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#6b7280',
                tabBarStyle: {
                  backgroundColor: '#020617',
                  borderTopColor: '#1f2933',
                },
                tabBarIcon: ({ color, size }) => {
                  let iconName;

                  if (route.name === 'Add Exercise') iconName = 'plus-circle';
                  else if (route.name === 'Exercise History') iconName = 'history';
                  else if (route.name === 'Coach') iconName = 'chat-processing';
                  else if (route.name === 'Settings') iconName = 'cog';

                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      color={color}
                      size={size}
                    />
                  );
                },
              })}
            >
              <Tab.Screen
                name="Add Exercise"
                component={AddExerciseScreen}
                options={{ tabBarLabel: language === 'fi' ? 'Lisää treeni' : 'Add' }}
              />
              <Tab.Screen
                name="Exercise History"
                component={ExerciseHistoryScreen}
                options={{
                  tabBarLabel: language === 'fi' ? 'Historia' : 'History',
                }}
              />
              <Tab.Screen
                name="Coach"
                component={ChatBotScreen}
                options={{
                  tabBarLabel: language === 'fi' ? 'Valmentaja' : 'Coach',
                }}
              />
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  tabBarLabel: language === 'fi' ? 'Asetukset' : 'Settings',
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </LanguageContext.Provider>
      </WorkoutContext.Provider>
    </PaperProvider>
  );
}
