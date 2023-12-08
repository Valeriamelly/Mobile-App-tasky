import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const UpdateProjectScreen = ({ navigation, route }) => {
    const { projectId, currentName, currentDescription } = route.params;
    
    const [name, setName] = useState(currentName);
    const [description, setDescription] = useState(currentDescription);
    const [isLoading, setIsLoading] = useState(false);

    const validateInput = () => {
        if (!name.trim() || !description.trim()) {
            Alert.alert("Error", "Por favor, rellena todos los campos.");
            return false;
        }
        if (name.length > 25) {
            Alert.alert("Error", "El nombre de la tarea debe tener máximo 25 caracteres.");
            return false;
        }
        if (description.length > 50) {
            Alert.alert("Error", "La descripción debe tener máximo 50 caracteres.");
            return false;
        }
        return true;
    };

    const handleUpdate = () => {
        if (!validateInput()) {
            return;
        }

        setIsLoading(true); // Iniciar el indicador de carga

        const projectData = {
            name: name,
            description: description,
        };

        axios.put(`http://192.168.1.7:8000/update-project/${projectId}`, projectData)
        .then(response => {
                console.log('Proyecto actualizado:', response.data);
                navigation.goBack(); // Puede que desees ir a una pantalla específica tras actualizar
            })
            .catch(error => {
                console.error('Error al actualizar el proyecto:', error);
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

            <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Actualizar Proyecto</Text>
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

export default UpdateProjectScreen;
