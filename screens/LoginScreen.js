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
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post("http://192.168.1.7:8000/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        const userEmail = response.data.userEmail; // Suponiendo que obtienes el correo electrónico en la respuesta
        const userId = response.data.userId; // Asegúrate de que esto esté siendo enviado desde el backend
        console.log(userId);

        AsyncStorage.setItem("authToken", token);
        AsyncStorage.setItem("userEmail", userEmail); // Guardar el correo electrónico
        AsyncStorage.setItem("userId", userId); // Guardar el ID del usuario

        navigation.replace("Main");
      })
      .catch((error) => {
        Alert.alert("Error en Login", error.response.data.error);
        console.log(error, error.response.data);
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
              fontSize: 25,
              fontWeight: "bold",
              marginTop: 12,
              color: "#6127aa",
            }}
          >
            Inicia Sesión
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#f1e9fe",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 20,
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

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#f1e9fe",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 20,
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
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Ingresa tu Contraseña"
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

          <Text onPress={() => navigation.navigate('RequestResetPassword')}>
              Olvidé mi contraseña
          </Text>
        </View>

        <View style={{ marginTop: 60 }} />

        <Pressable
          onPress={handleLogin}
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
            Iniciar Sesión
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
