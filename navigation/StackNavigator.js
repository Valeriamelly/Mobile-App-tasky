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
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ProjectScreen from "../screens/ProjectScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddProjectScreen from "../screens/AddProjectScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import RequestResetPasswordScreen from "../screens/RequestResetPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";


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
            tabBarLabel: "Home",
            tabBarLabelStyle: {color:"#383a5b"},
            headerShown: false,
            tabBarIcon: ({focused}) => 
            focused ? (
              <Entypo name="home" size={30} color="#383a5b" />
              
            ) : (
              <AntDesign name="home" size={30} color="black" />
            ),
          }}
        />
        <Tab.Screen 
          name="Project"
          component={ProjectScreen} //antes ibas ProjectScreen
          options={{
            tabBarLabel: "Task",
            tabBarLabelStyle: {color:"#383a5b"},
            headerShown: false,
            tabBarIcon: ({focused}) => 
            focused ? (
              <FontAwesome5 name="tasks" size={30} color="#383a5b" />
              
            ) : (
              <FontAwesome5 name="tasks" size={30} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: {color:"#383a5b"},
            headerShown: false,
            tabBarIcon: ({focused}) => 
            focused ? (
              <MaterialIcons name="person" size={30} color="#383a5b" />
              
            ) : (
              <Ionicons name="person-outline" size={30} color="black" />
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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProjectScreen"
          component={ProjectScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProject"
          component={AddProjectScreen}
          options={{ headerShown: false}} // Configura las opciones según tus preferencias
        />
        <Stack.Screen 
        name="AddTask" 
        component={AddTaskScreen} 
        options={{ headerShown: false}} // Configura las opciones según tus preferencias
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
