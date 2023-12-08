// Importa las bibliotecas y componentes necesarios
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";

const ResetPasswordScreen = ({ navigation }) => {
  const [verificationToken, setVerificationToken] = useState(""); // Cambiado de verificationToken a verificationToken
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = () => {
    if (!verificationToken || !newPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Su contraseña debe ser mayor de 8 caracteres");
      return false;
    }

    axios
      .post("http://192.168.1.7:8000/reset-password", {
        verificationToken,
        newPassword,
      })
      .then((response) => {
        Alert.alert("Éxito", "Tu contraseña ha sido restablecida.");
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert("Error", "Código de verificación inválido o expirado.");
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 70,
            color: "#6127aa",
          }}
        >
          Restablecer Contraseña
        </Text>
      </View>

      <View style={{ marginTop: 40 }}>
        {/* Ingresa el código de verificación */}
        <TextInput
          value={verificationToken}
          onChangeText={(text) => setVerificationToken(text)}
          style={{
            color: "gray",
            marginVertical: 10,
            width: 300,
            height: 50,
            fontSize: verificationToken ? 16 : 16,
            backgroundColor: "#f1e9fe",
            paddingVertical: 5,
            borderRadius: 5,
          }}
          placeholder="Código de verificación"
        />

        {/* Ingresa la nueva contraseña */}
        <TextInput
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
          style={{
            color: "gray",
            marginVertical: 10,
            width: 300,
            height: 50,
            fontSize: newPassword ? 16 : 16,
            backgroundColor: "#f1e9fe",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 20,
          }}
          secureTextEntry={true}
          placeholder="Nueva Contraseña"
        />
      </View>

      <Pressable
        onPress={handleResetPassword}
        style={{
          width: 200,
          backgroundColor: "#d1b6fc",
          borderRadius: 6,
          marginLeft: "auto",
          marginRight: "auto",
          padding: 15,
          marginTop: 20,
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
          Restablecer Contraseña
        </Text>
      </Pressable>
      <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
        <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
          Volver
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({});
