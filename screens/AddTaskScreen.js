import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTaskScreen = ({ navigation, route }) => {
    const { projectId } = route.params;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    
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

    const handleSave = async () => {
        // Combina la fecha y la hora para el inicio y el fin
        const combinedStartDate = new Date(startDate);
        combinedStartDate.setHours(startTime.getHours());
        combinedStartDate.setMinutes(startTime.getMinutes());

        const combinedEndDate = new Date(endDate);
        combinedEndDate.setHours(endTime.getHours());
        combinedEndDate.setMinutes(endTime.getMinutes());
        const userEmail = await AsyncStorage.getItem("userEmail");

        if (!validateInput()) {
            return;
        }
        
        const taskData = {
            name,
            description,
            projectId,
            startDate: combinedStartDate,
            endDate: combinedEndDate,
            userEmail
        };

        // Llama a tu API para guardar la tarea
        axios.post('http://192.168.18.6:8000/tasks/add-task', taskData)
            .then(response => {
                console.log('Tarea guardada:', response.data);
                navigation.goBack();
            })
            .catch(error => {
                console.error('Error al guardar la tarea:', error);
            });
    };

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    const onChangeStartTime = (event, selectedDate) => {
        const currentDate = selectedDate || startTime;
        setShowStartTimePicker(false);
        setStartTime(currentDate);
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
    };

    const onChangeEndTime = (event, selectedDate) => {
        const currentDate = selectedDate || endTime;
        setShowEndTimePicker(false);
        setEndTime(currentDate);
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

            <Button title="Seleccionar fecha de inicio" onPress={() => setShowStartDatePicker(true)} />
            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChangeStartDate}
                />
            )}

            <Button title="Seleccionar hora de inicio" onPress={() => setShowStartTimePicker(true)} />
            {showStartTimePicker && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={onChangeStartTime}
                />
            )}

            <Button title="Seleccionar fecha de fin" onPress={() => setShowEndDatePicker(true)} />
            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onChangeEndDate}
                />
            )}

            <Button title="Seleccionar hora de fin" onPress={() => setShowEndTimePicker(true)} />
            {showEndTimePicker && (
                <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={onChangeEndTime}
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
