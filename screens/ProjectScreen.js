// ProjectScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ProjectScreen = ({ route }) => {
    // Simulamos la obtención del ID del proyecto seleccionado
    const { projectId } = route.params;

    // Simulamos las tareas asociadas al proyecto seleccionado
    const tasks = [
        { id: '1', name: 'Tarea 1', startDate: '2023-01-01', endDate: '2023-01-05' },
        { id: '2', name: 'Tarea 2', startDate: '2023-01-06', endDate: '2023-01-10' },
        // ... otras tareas
    ];

    const renderTask = ({ item }) => (
        <View style={styles.taskCard}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text style={styles.taskDate}>{item.startDate} - {item.endDate}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.projectTitle}>Proyecto {projectId}</Text>
            <AntDesign name="edit" size={24} color="black" onPress={() => {}} />
            
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    taskCard: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    taskName: {
        fontSize: 18,
    },
    taskDate: {
        color: 'gray',
    },
});

export default ProjectScreen;
