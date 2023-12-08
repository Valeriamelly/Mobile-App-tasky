import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  
  const validateInput = () => {
    if (!name.trim() || !email.trim()|| !password.trim()) {
      Alert.alert("Error", "Por favor, rellena todos los campos.");
      return false;
  }
    if (password.length <8) {
        Alert.alert("Error", "Su contraseña debe ser mayor de 8 caracteres");
        return false;
    }
    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        Alert.alert("Error", "Ingrese una dirección de correo electrónico válida");
        return false;
    }
    return true;
  };
  //funcion que permite registrar con los campos indicados 
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    if (!validateInput()) {
      return;
  }
  
  axios
      .post("http://192.168.1.7:8000/register", user) 
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registro exitoso",
          "Ha sido registrado exitosamente"
        );
        navigation.navigate('Login');
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Error al registrarse",
          "Un error ocurrió mientras se registraba"
        );
        console.log("registro fallido", error);
      });
  };
  
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 300, height: 100, marginTop: 70 }}
          source={{
            uri: "https://cdn.discordapp.com/attachments/1097713475654000671/1182544196679245824/zyro-image.png?ex=6585151b&is=6572a01b&hm=b7ec9adcdb7f717870af6fce4e3298cc6e53eccd3f2a348c836245ea6d861202&",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginTop: 12,
              color: "#6127aa",
            }}
          >
            Registra tu cuenta
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#f1e9fe",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <Ionicons
              name="ios-person"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: name ? 16 : 16,
              }}
              placeholder="Ingresa tu nombre"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#f1e9fe",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialCommunityIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />      

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Ingresa tu email"
            />
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#f1e9fe",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry = {true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Ingresa tu contraseña"
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

        </View>

        <View style={{ marginTop: 60 }} />

        <Pressable
        onPress={handleRegister}
          style={{
            width: 200,
            backgroundColor: "#d1b6fc",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#320a61",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Registrarse
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Ya tienes una cuenta? Inicia Sesión
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
