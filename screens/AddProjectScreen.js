import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const AddProjectScreen = ({ navigation }) => {
    const [name, setName] = useState(''); // Define el estado para el nombre
    const [description, setDescription] = useState(''); // Define el estado para la descripción

    const handleSave = () => {
        const projectData = {
            name: name,
            description: description,
        };

        axios.post('http://192.168.18.50:8000/add-project', projectData)
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
