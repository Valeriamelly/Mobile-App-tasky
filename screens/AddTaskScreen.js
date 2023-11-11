import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker'; // Asegúrate de tener esta dependencia instalada

const AddTaskScreen = ({ navigation, route }) => {
    const { projectId } = route.params;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const handleSave = () => {
        const taskData = {
            name,
            description,
            projectId,
            startDate, // Asegúrate de formatear las fechas según lo esperado por tu backend
            endDate
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

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartPicker(false);
        setStartDate(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndPicker(false);
        setEndDate(currentDate);
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

            <Button title="Seleccionar fecha de inicio" onPress={() => setShowStartPicker(true)} />
            {showStartPicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChangeStart}
                />
            )}

            <Button title="Seleccionar fecha de fin" onPress={() => setShowEndPicker(true)} />
            {showEndPicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onChangeEnd}
                />
            )}

            <Button title="Guardar Tarea" onPress={handleSave} />

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
