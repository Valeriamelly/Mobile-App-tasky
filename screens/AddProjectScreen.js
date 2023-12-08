import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Ensure the correct import statement

const AddProjectScreen = ({ navigation }) => {
    const [name, setName] = useState(''); // Define el estado para el nombre
    const [description, setDescription] = useState(''); // Define el estado para la descripción
    const [isLoading, setIsLoading] = useState(false);

    const validateInput = () => {
        if (!name.trim() || !description.trim()) {
            Alert.alert("Error", "Por favor, rellena todos los campos.");
            return false;
        }
        if (name.length > 25) {
            Alert.alert("Error", "El nombre del proyecto debe tener máximo 25 caracteres.");
            return false;
        }
        if (description.length > 50) {
            Alert.alert("Error", "La descripción debe tener máximo 50 caracteres.");
            return false;
        }
        return true;
    };

    const handleSave = async () => {

        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
            Alert.alert("Error", "No se pudo obtener el ID del usuario");
            setIsLoading(false); // Detener el indicador de carga
            return;
        }
        if (!validateInput()) {
            return;
        }

        setIsLoading(true); // Iniciar el indicador de carga

        const projectData = {
            name: name,
            description: description,
            userId: userId, // Incluir el userId aquí

        };

        axios.post('http://192.168.1.7:8000/add-project', projectData)
            .then(response => {
                console.log('Proyecto guardado:', response.data);
                navigation.goBack(); // Volver a la pantalla anterior
            })
            .catch(error => {
                console.error('Error al guardar el proyecto:', error);
                setIsLoading(false); // Detener el indicador de carga en caso de error
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre del Proyecto:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ingrese el nombre del proyecto"
            />

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Ingrese la descripción del proyecto"
                multiline
            />
            
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar Proyecto</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: '#d1b6fc',
        padding: 15,
        borderRadius: 10,
    },
    saveButtonText: {
        color: '#320a61',
        fontSize: 16,
        textAlign: 'center',
    },
    // ... otros estilos que necesites
});

export default AddProjectScreen;
