import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const AddProjectScreen = ({ navigation }) => {
    const [name, setName] = useState(''); // Define el estado para el nombre
    const [description, setDescription] = useState(''); // Define el estado para la descripción
    const [isLoading, setIsLoading] = useState(false);

    const validateInput = () => {
        if (!name.trim() || !description.trim()) {
            Alert.alert("Error", "Por favor, rellena todos los campos.");
            return false;
        }
        if (name.length < 8) {
            Alert.alert("Error", "El nombre del proyecto debe tener al menos 8 caracteres.");
            return false;
        }
        if (description.length < 20) {
            Alert.alert("Error", "La descripción debe tener al menos 20 caracteres.");
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!validateInput()) {
            return;
        }

        setIsLoading(true); // Iniciar el indicador de carga

        const projectData = {
            name: name,
            description: description,
        };

        axios.post('http://192.168.1.5:8000/add-project', projectData)
            .then(response => {
                console.log('Proyecto guardado:', response.data);
                navigation.goBack();
            })
            .catch(error => {
                console.error('Error al guardar el proyecto:', error);
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

            <Button
                title="Guardar Proyecto"
                onPress={handleSave}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    // ... otros estilos que necesites
});

export default AddProjectScreen;
