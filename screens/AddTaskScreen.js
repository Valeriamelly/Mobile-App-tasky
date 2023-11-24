import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const AddTaskScreen = ({ navigation, route }) => {
    const { projectId } = route.params; // Asume que se pasa el ID del proyecto como parámetro
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
 
    const validateInput = () => {
        if (!name.trim() || !description.trim()) {
            Alert.alert("Error", "Por favor, rellena todos los campos.");
            return false;
        }
        if (name.length < 3) {
            Alert.alert("Error", "El nombre de la tarea debe tener al menos 3 caracteres.");
            return false;
        }
        if (description.length < 5) {
            Alert.alert("Error", "La descripción debe tener al menos 5 caracteres.");
            return false;
        }
        // Aquí puedes agregar más validaciones si lo necesitas
        return true;
    };

    const handleSave = () => {

        if (!validateInput()) {
            return;
        }
        
        const taskData = {
            name,
            description,
            projectId,
           
        };

        // Llama a tu API para guardar la tarea
        axios.post('http://192.168.1.11:8000/add-task', taskData)
            .then(response => {
                console.log('Tarea guardada:', response.data);
                setName('');
                setDescription('');
                navigation.goBack();
            })
            .catch(error => {
                console.error('Error al guardar la tarea:', error);
            });
            
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre de la Tarea:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ingrese el nombre de la tarea"
            />

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Ingrese la descripción de la tarea"
                multiline
            />

            {/* Aquí puedes agregar selectores de fecha para las fechas de inicio y fin */}

            <Button
                title="Guardar Tarea"
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

export default AddTaskScreen;