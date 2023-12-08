import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ProjectScreen from "../screens/ProjectScreen";
import AddProjectScreen from "../screens/AddProjectScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UpdateProjectScreen from "../screens/UpdateProjectScreen";
import UpdateTaskScreen from "../screens/UpdateTaskScreen";
import RequestResetPasswordScreen from "../screens/RequestResetPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import CalendarView from "../screens/CalendarView";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Inicio",
            tabBarLabelStyle: { color: "#000000" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={30} color="#4e2083" />

              ) : (
                <AntDesign name="home" size={30} color="#4e2083" />
              ),
          }}
        />
        <Tab.Screen
          name="CalendarView"
          component={CalendarView} //antes ibas HomeScreen
          options={{
            tabBarLabel: "Calendario",
            tabBarLabelStyle: { color: "#000000" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome5 name="calendar" size={30} color="#4e2083" />

              ) : (
                <FontAwesome name="calendar-o" size={30} color="#4e2083" />

              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Perfil",
            tabBarLabelStyle: { color: "#000000" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="person" size={30} color="#4e2083" />

              ) : (
                <Ionicons name="person-outline" size={30} color="#4e2083" />
              ),
          }}
        />


      </Tab.Navigator>

    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ 
            headerTitle: 'Tasky',
          }}  
        />
        <Stack.Screen
          name="ProjectScreen"
          component={ProjectScreen}
          options={{ 
            headerTitle: 'Proyectos',
          }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProject"
          component={AddProjectScreen}
          options={{ 
            headerTitle: 'Añadir Proyectos',
          }}  
        />
        <Stack.Screen 
          name="UpdateProject" 
          component={UpdateProjectScreen} 
          options={{ 
            headerTitle: 'Proyectos',
          }}  
        />
        <Stack.Screen 
          name="UpdateTask" 
          component={UpdateTaskScreen} 
          options={{ 
            headerTitle: 'Tareas',
          }}  
        />
        <Stack.Screen 
        name="AddTask" 
        component={AddTaskScreen} 
        options={{ headerTitle: 'Añadir Tarea',
       }}  
        // Opciones adicionales como `options` si son necesarias
      />
      <Stack.Screen
          name="RequestResetPassword"
          component={RequestResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CalendarView"
          component={CalendarView}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});