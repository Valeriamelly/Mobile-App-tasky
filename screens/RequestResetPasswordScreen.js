// Importa los módulos necesarios
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

const RequestResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const validateInput = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor, rellena todos los campos.");
      return false;
    }
    return true;
  };
  
  // Función para solicitar restablecimiento de contraseña
  const handleRequestResetPassword = () => {
    if (!validateInput()) {
      return;
    }
    axios
      .post("http://192.168.1.7:8000/request-reset-password", { email })
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Solicitud enviada",
          "Se ha enviado un correo con las instrucciones para restablecer tu contraseña."
        );
        setEmail("");
        //navigation.goBack();
        navigation.navigate("ResetPassword"); // Después de enviar la solicitud, navega a ResetPasswordScreen

      })
      .catch((error) => {
        Alert.alert(
          "Error al enviar la solicitud",
          "Ocurrió un error al procesar la solicitud. Verifica tu dirección de correo electrónico."
        );
        console.log("Error al enviar la solicitud:", error);
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 300, height: 100, marginTop: 70  }}
          source={{
            uri: "https://cdn.discordapp.com/attachments/1097713475654000671/1182544196679245824/zyro-image.png?ex=6585151b&is=6572a01b&hm=b7ec9adcdb7f717870af6fce4e3298cc6e53eccd3f2a348c836245ea6d861202&",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Solicitar Restablecimiento de Contraseña
          </Text>
        </View>

        <View style={{ marginTop: 70 }}>
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
              placeholder="Ingresa tu Email"
            />
          </View>
        </View>

        <Pressable
          onPress={handleRequestResetPassword}
          style={{
            width: 200,
            backgroundColor: "#d1b6fc",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
            marginTop: 30,
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
            Enviar Solicitud
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Volver a Iniciar Sesión
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RequestResetPasswordScreen;

const styles = StyleSheet.create({});