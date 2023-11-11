import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, DatePickerAndroid } from 'react-native';
import axios from 'axios';

const AddTaskScreen = ({ navigation, route }) => {
    const { projectId } = route.params; // Asume que se pasa el ID del proyecto como parámetro
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
 

    const handleSave = () => {
        const taskData = {
            name,
            description,
            projectId,
           
        };

        axios.post('http://192.168.18.50:8000/add-task', taskData)
            .then(response => {
                console.log('Tarea guardada:', response.data);
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
