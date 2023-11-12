import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [isFetching, setIsFetching] = useState(true); // Para manejar la carga de datos
  const [greeting, setGreeting] = useState(""); // Saludo con el nombre


  // Esta función obtendrá los datos del perfil del usuario
  const fetchUserProfile = async () => {
    setIsFetching(true);
    try {
      // Suponiendo que tienes el authToken guardado en AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        return;
      }
      // Asume que tu backend valida el token y devuelve la información del usuario
      const response = await axios.get("http://192.168.1.8:8000/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en el header
        },
      });
      const { name, email } = response.data;
      setName(name);
      setEmail(email);
      setGreeting(`Tasky de ${name}!`); // Saludo con el nombre actual
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
      Alert.alert("Error", "No se pudo obtener la información del perfil.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      // Obtener el token de autenticación almacenado
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        return;
      }

      // Realizar la solicitud para actualizar los datos del usuario
      await axios.put(
        "http://192.168.1.8:8000/profile",
        {
          name,
          password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert(
        "Perfil Actualizado",
        "Tu perfil ha sido actualizado con éxito."
      );
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar tu perfil.");
      console.error("Error al actualizar el perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // Eliminar el token de autenticación
      navigation.replace("Login"); // Redirigir al usuario a la pantalla de inicio de sesión
    } catch (error) {
      Alert.alert("Error", "Error al cerrar sesión");
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{greeting}</Text>
      {/* Añade esto dentro del return de tu componente ProfileScreen */}
      {!isFetching && (
        <>
          {/* Muestra el nombre que puede ser editado */}
          <Text style={styles.label}>Nombre de Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />

          {/* Muestra el correo electrónico sin la opción de editar */}
          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.input}>
            <Text>{email}</Text>
          </View>

          {/* Campo para actualizar la contraseña */}
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable
            onPress={handleUpdateProfile}
            style={{
              backgroundColor: "#504c94",
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
              }}
            >
              Actualizar Perfil
            </Text>
          </Pressable>
        </>
      )}

      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: "50%", // o el ancho que desees
  },
  label: {},
  logoutButton: {
    backgroundColor: "#504c94",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ProfileScreen;
