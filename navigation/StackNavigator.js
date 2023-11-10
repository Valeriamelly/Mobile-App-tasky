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
import TaskScreen from "../screens/TaskScreen";
import ProfileScreen from "../screens/ProfileScreen";


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
            tabBarLabelStyle: {color:"#FB2576"},
            headerShown: false,
            tabBarIcon: ({focused}) => 
            focused ? (
              <Entypo name="home" size={30} color="#FB2576" />
              
            ) : (
              <AntDesign name="home" size={30} color="black" />
            ),
          }}
        />
        <Tab.Screen 
          name="Task"
          component={TaskScreen} //antes ibas ProjectScreen
          options={{
            tabBarLabel: "Task",
            tabBarLabelStyle: {color:"#FB2576"},
            headerShown: false,
            tabBarIcon: ({focused}) => 
            focused ? (
              <FontAwesome5 name="tasks" size={30} color="#FB2576" />
              
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
            tabBarLabelStyle: {color:"#FB2576"},
            headerShown: false,
            tabBarIcon: ({focused}) => 
            focused ? (
              <MaterialIcons name="person" size={30} color="#FB2576" />
              
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

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
