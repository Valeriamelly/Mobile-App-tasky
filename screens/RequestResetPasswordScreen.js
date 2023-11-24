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

  // Función para solicitar restablecimiento de contraseña
  const handleRequestResetPassword = () => {
    axios
      .post("http://192.168.1.11:8000/request-reset-password", { email })
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
          style={{ width: 170, height: 100 }}
          source={{
            uri: "https://info.cegedim-healthcare.co.uk/hubfs/CHS_Tasks%20logo.png",
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
              backgroundColor: "#D0D0D0",
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
            backgroundColor: "#7743DB",
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
              color: "white",
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
