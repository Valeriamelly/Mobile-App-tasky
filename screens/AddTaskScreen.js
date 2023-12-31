import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';

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
        if (name.length < 8) {
            Alert.alert("Error", "El nombre de la tarea debe tener al menos 8 caracteres.");
            return false;
        }
        if (description.length < 10) {
            Alert.alert("Error", "La descripción debe tener al menos 10 caracteres.");
            return false;
        }
        // Aquí puedes agregar más validaciones si lo necesitas
        // Validar que la fecha de inicio sea igual o mayor a la fecha actual
        if (moment(startDate).isBefore(moment(), 'day')) {
            Alert.alert("Error", "La fecha de inicio debe ser hoy o en el futuro.");
            return false;
        }

        
        return true;
    };

    const formatDate = (date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const formatTime = (time) => {
        return `${time.getHours()}:${time.getMinutes()}`;
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

        // Validar que la fecha de término sea posterior a la fecha de inicio
        if (moment(combinedEndDate).isSameOrBefore(moment(combinedStartDate))) {
            Alert.alert("Error", "La fecha de término debe ser posterior a la fecha de inicio.");
            return false;
        }
        

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
        axios.post('http://192.168.1.5:8000/add-task', taskData)
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

            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                <View pointerEvents="none">
                    <TextInput
                        style={styles.input}
                        value={`Fecha de inicio: ${formatDate(startDate)}`}
                        placeholder="Seleccionar fecha de inicio"
                        editable={false}
                    />
                </View>
            </TouchableOpacity>
            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChangeStartDate}
                />
            )}

            <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                <View pointerEvents="none">
                    <TextInput
                        style={styles.input}
                        value={`Hora de inicio: ${formatTime(startTime)}`}
                        placeholder="Seleccionar hora de inicio"
                        editable={false}
                    />
                </View>
            </TouchableOpacity>
            {showStartTimePicker && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={onChangeStartTime}
                />
            )}

            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                <View pointerEvents="none">
                    <TextInput
                        style={styles.input}
                        value={`Fecha de fin: ${formatDate(endDate)}`}
                        placeholder="Seleccionar fecha de fin"
                        editable={false}
                    />
                </View>
            </TouchableOpacity>
            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onChangeEndDate}
                />
            )}

            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                <View pointerEvents="none">
                    <TextInput
                        style={styles.input}
                        value={`Hora de fin: ${formatTime(endTime)}`}
                        placeholder="Seleccionar hora de fin"
                        editable={false}
                    />
                </View>
            </TouchableOpacity>
            {showEndTimePicker && (
                <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={onChangeEndTime}
                />
            )}

            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar Tarea</Text>
            </TouchableOpacity>
        </View>
    );
};

    /*
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

*/

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
        width: '100%', //nuevo
    },
    // ... otros estilos que necesites
    saveButton: {
        backgroundColor: '#504c94',
        padding: 15,
        borderRadius: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AddTaskScreen;
