import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const AddProjectScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateInput = () => {
        if (!name.trim() || !description.trim()) {
            Alert.alert("Error", "Por favor, rellena todos los campos.");
            return false;
        }
        if (name.length < 3) {
            Alert.alert("Error", "El nombre del proyecto debe tener al menos 3 caracteres.");
            return false;
        }
        if (description.length < 10) {
            Alert.alert("Error", "La descripción debe tener al menos 10 caracteres.");
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!validateInput()) {
            return;
        }

        setIsLoading(true);
        const projectData = {
            name: name,
            description: description,
        };

        axios.post('http://192.168.1.8:8000/add-project', projectData)
            .then(response => {
                Alert.alert("Éxito", "Proyecto guardado correctamente.");
                navigation.goBack();
            })
            .catch(error => {
                Alert.alert("Error", "No se pudo guardar el proyecto.");
                console.error('Error al guardar el proyecto:', error);
            })
            .finally(() => {
                setIsLoading(false);
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

            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button
                    title="Guardar Proyecto"
                    onPress={handleSave}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        paddingTop: 50,
    },
    label: {
        fontSize: 16,
        marginBottom: 20,
        paddingTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    // ... otros estilos que necesites
});

export default AddProjectScreen;
