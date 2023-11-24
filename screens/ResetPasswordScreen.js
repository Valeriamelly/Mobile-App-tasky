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

const ResetPasswordScreen = ( { navigation }) => {
    const [verificationToken, setVerificationToken] = useState(""); // Cambiado de verificationToken a verificationToken
    const [newPassword, setNewPassword] = useState("");

    const handleResetPassword = () => {
      if (!verificationToken || !newPassword) {
          Alert.alert("Error", "Todos los campos son obligatorios.");
          return;
      }

      axios.post("http://192.168.1.11:8000/reset-password", { verificationToken, newPassword })
          .then(response => {
              Alert.alert("Éxito", "Tu contraseña ha sido restablecida.");
              navigation.navigate('Login');
          })
          .catch(error => {
              Alert.alert("Error", "Código de verificación inválido o expirado.");
          });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 12, color: "#041E42" }}>
          Restablecer Contraseña
        </Text>
      </View>

      <View style={{ marginTop: 70 }}>
        {/* Ingresa el código de verificación */}
        <TextInput
          value={verificationToken}
          onChangeText={(text) => setVerificationToken(text)}
          style={{
            color: "gray",
            marginVertical: 10,
            width: 300,
            fontSize: verificationToken ? 16 : 16,
            backgroundColor: "#D0D0D0",
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
            fontSize: newPassword ? 16 : 16,
            backgroundColor: "#D0D0D0",
            paddingVertical: 5,
            borderRadius: 5,
          }}
          secureTextEntry={true}
          placeholder="Nueva Contraseña"
        />
      </View>

      <Pressable
        onPress={handleResetPassword}
        style={{
          width: 200,
          backgroundColor: "#7743DB",
          borderRadius: 6,
          marginLeft: "auto",
          marginRight: "auto",
          padding: 15,
          marginTop: 20,
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>
          Restablecer Contraseña
        </Text>
      </Pressable>
      <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Volver 
          </Text>
        </Pressable>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({});

